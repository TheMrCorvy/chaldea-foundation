import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCastProps {
    videoSrc: string;
    subtitleSrc?: string;
    metadata?: {
        subsLabel: string;
        subsLanguage: string;
    };
}

interface CastContextInstance {
    setOptions: (options: {
        receiverApplicationId: string;
        autoJoinPolicy: string;
    }) => void;
    getCurrentSession: () => CastSession | null;
    requestSession: () => Promise<void>;
}

interface CastSession {
    getMediaSession: () => unknown;
    loadMedia: (request: LoadRequestInstance) => Promise<void>;
}

interface RemotePlayerControllerInstance {
    playOrPause: () => void;
}

interface MediaInfoInstance {
    streamType: string;
    tracks?: unknown[];
    textTrackStyle?: Record<string, unknown>;
}

interface LoadRequestInstance {
    activeTrackIds?: number[];
}

interface CastWindow extends Window {
    cast?: {
        framework: {
            CastContext: {
                getInstance: () => CastContextInstance;
            };
            RemotePlayer: new () => unknown;
            RemotePlayerController: new (
                player: unknown
            ) => RemotePlayerControllerInstance;
        };
    };
    chrome?: {
        cast: {
            AutoJoinPolicy: {
                ORIGIN_SCOPED: string;
            };
            media: {
                MediaInfo: new (
                    contentUrl: string,
                    contentType: string
                ) => MediaInfoInstance;
                LoadRequest: new (
                    mediaInfo: MediaInfoInstance
                ) => LoadRequestInstance;
            };
        };
    };
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
}

const DEFAULT_RECEIVER_APP_ID = "CC1AD845";

export const useCast = ({ videoSrc, subtitleSrc, metadata }: UseCastProps) => {
    const [castReady, setCastReady] = useState(false);
    const [casting, setCasting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remotePlayerRef = useRef<unknown>(null);
    const remoteControllerRef = useRef<RemotePlayerControllerInstance | null>(
        null
    );

    useEffect(() => {
        const win = window as unknown as CastWindow;

        const initCast = () => {
            if (!win.cast || !win.chrome) return;
            const context = win.cast.framework.CastContext.getInstance();
            context.setOptions({
                receiverApplicationId: DEFAULT_RECEIVER_APP_ID,
                autoJoinPolicy: win.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
            });

            remotePlayerRef.current = new win.cast.framework.RemotePlayer();
            remoteControllerRef.current =
                new win.cast.framework.RemotePlayerController(
                    remotePlayerRef.current
                );

            setCastReady(true);
        };

        if (win.cast?.framework) {
            initCast();
            return;
        }

        win.__onGCastApiAvailable = (isAvailable: boolean) => {
            if (isAvailable) initCast();
        };
    }, []);

    const loadMedia = useCallback(async () => {
        const win = window as unknown as CastWindow;
        if (!win.cast || !win.chrome) return;
        const context = win.cast.framework.CastContext.getInstance();
        const session = context.getCurrentSession();

        if (!session) return;

        const mediaInfo = new win.chrome.cast.media.MediaInfo(
            videoSrc,
            "application/x-mpegURL"
        );

        mediaInfo.streamType = "BUFFERED";

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

        const request = new win.chrome.cast.media.LoadRequest(mediaInfo);

        if (subtitleSrc && metadata) {
            request.activeTrackIds = [1];
        }

        await session.loadMedia(request);
    }, [videoSrc, subtitleSrc, metadata]);

    const handleCast = useCallback(async () => {
        setError(null);
        setCasting(true);

        try {
            const win = window as unknown as CastWindow;
            if (!win.cast) {
                throw new Error("Chromecast Cast API not loaded");
            }
            const context = win.cast.framework.CastContext.getInstance();
            let session = context.getCurrentSession();

            if (!session) {
                await context.requestSession();
                session = context.getCurrentSession();
            }

            if (!session) return;

            const mediaSession = session.getMediaSession();

            if (mediaSession && remoteControllerRef.current) {
                remoteControllerRef.current.playOrPause();
                return;
            }

            await loadMedia();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Chromecast error");
        } finally {
            setCasting(false);
        }
    }, [loadMedia]);

    return {
        castReady,
        casting,
        error,
        handleCast,
    };
};
