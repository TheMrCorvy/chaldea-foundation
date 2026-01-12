import { FC, useEffect, useRef, useState } from "react";
import Button from "@mui/joy/Button";

export interface CastToTvProps {
    videoSrc: string;
    subtitleSrc?: string;
    metadata?: {
        subsLanguage: string;
        subsLabel: string;
    };
}

interface CastSession {
    loadMedia: (request: LoadRequest) => Promise<void>;
}

interface MediaInfo {
    tracks?: Array<{
        trackId: number;
        type: string;
        trackContentId: string;
        trackContentType: string;
        subtype: string;
        name: string;
        language: string;
        customData: null;
    }>;
    textTrackStyle?: object;
}

interface LoadRequest {
    activeTrackIds?: number[];
}

interface CastWindow extends Window {
    cast?: {
        framework?: {
            CastContext: {
                getInstance: () => {
                    setOptions: (opts: unknown) => void;
                    getCurrentSession: () => CastSession | null;
                    requestSession: () => void;
                };
            };
        };
    };
    chrome?: {
        cast?: {
            media?: {
                DEFAULT_MEDIA_RECEIVER_APP_ID?: string;
                MediaInfo?: new (
                    contentId: string,
                    contentType: string
                ) => MediaInfo;
                LoadRequest?: new (mediaInfo: MediaInfo) => LoadRequest;
            };
            AutoJoinPolicy?: {
                ORIGIN_SCOPED?: string;
            };
        };
    };
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
}

const getDefaultReceiverAppId = (): string => {
    const win = window as CastWindow;
    return win.chrome?.cast?.media?.DEFAULT_MEDIA_RECEIVER_APP_ID || "CC1AD845";
};

const CastToTv: FC<CastToTvProps> = ({ videoSrc, subtitleSrc, metadata }) => {
    const [castReady, setCastReady] = useState(false);
    const [casting, setCasting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Determinar si el botón debe estar habilitado
    const canCast =
        !!videoSrc &&
        ((!subtitleSrc && !metadata) || // Solo video
            (!!subtitleSrc && !!metadata)); // Video + subtítulos + metadata

    // Inicializar el contexto de Cast cuando el SDK esté listo
    useEffect(() => {
        const win = window as CastWindow;

        // Si el SDK ya está disponible, inicializar inmediatamente
        if (win.cast && win.cast.framework) {
            win.cast.framework.CastContext.getInstance().setOptions({
                receiverApplicationId: getDefaultReceiverAppId(),
                autoJoinPolicy: win.chrome?.cast?.AutoJoinPolicy?.ORIGIN_SCOPED,
            });
            setCastReady(true);
            return;
        }

        // Si no está disponible, esperar a que el SDK se cargue
        const originalCallback = win.__onGCastApiAvailable;
        win.__onGCastApiAvailable = function (isAvailable: boolean) {
            if (isAvailable) {
                win.cast?.framework?.CastContext.getInstance().setOptions({
                    receiverApplicationId: getDefaultReceiverAppId(),
                    autoJoinPolicy:
                        win.chrome?.cast?.AutoJoinPolicy?.ORIGIN_SCOPED,
                });
                setCastReady(true);
            } else {
                setCastReady(false);
            }
            // Llamar al callback original si existe
            if (typeof originalCallback === "function") {
                originalCallback(isAvailable);
            }
        };

        return () => {
            // Restaurar el callback original al desmontar
            if (originalCallback) {
                win.__onGCastApiAvailable = originalCallback;
            } else {
                delete win.__onGCastApiAvailable;
            }
        };
    }, []);

    // Función para lanzar el video al Chromecast
    const handleCast = async () => {
        setError(null);
        setCasting(true);

        try {
            const win = window as CastWindow;
            const context = win.cast?.framework?.CastContext.getInstance();

            if (!context) throw new Error("Google Cast no está disponible");

            const session = context.getCurrentSession();

            if (!session) {
                context.requestSession();
                return;
            }

            // Crear mediaInfo
            const MediaInfoCtor = win.chrome?.cast?.media?.MediaInfo;

            if (!MediaInfoCtor)
                throw new Error("No se encontró MediaInfo en Cast SDK");

            const mediaInfo: MediaInfo = new MediaInfoCtor(
                videoSrc,
                "video/mp4"
            );

            // Si hay subtítulos y metadata, añadirlos
            if (subtitleSrc && metadata) {
                mediaInfo.tracks = [
                    {
                        trackId: 1,
                        type: "TEXT",
                        trackContentId: subtitleSrc,
                        trackContentType: "text/vtt",
                        subtype: "SUBTITLES",
                        name: metadata.subsLabel,
                        language: metadata.subsLanguage,
                        customData: null,
                    },
                ];
                mediaInfo.textTrackStyle = {};
            }

            // Crear la petición de carga
            const LoadRequestCtor = win.chrome?.cast?.media?.LoadRequest;

            if (!LoadRequestCtor)
                throw new Error("No se encontró LoadRequest en Cast SDK");

            const request: LoadRequest = new LoadRequestCtor(mediaInfo);

            // Activar el track de subtítulos por defecto si corresponde
            if (subtitleSrc && metadata) {
                request.activeTrackIds = [1];
            }

            await session.loadMedia(request);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Error al enviar a Chromecast");
            }
        } finally {
            setCasting(false);
        }
    };

    // Si el SDK no está listo, mostrar un botón deshabilitado
    return (
        <Button
            ref={buttonRef}
            variant="solid"
            color="primary"
            disabled={!castReady || !canCast || casting}
            loading={casting}
            onClick={handleCast}
            startDecorator={
                // Icono simple de cast
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 16.1V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v.9" />
                    <line x1="2" y1="20" x2="2" y2="20" />
                    <path d="M7 20a5 5 0 0 0-5-5" />
                </svg>
            }
        >
            Cast to TV
            {error && (
                <span style={{ color: "red", marginLeft: 8 }}>{error}</span>
            )}
        </Button>
    );
};

export default CastToTv;
