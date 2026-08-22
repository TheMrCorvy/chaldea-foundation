import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCastProps {
    videoSrc: string;
    subtitleSrc?: string;
    metadata?: {
        subsLabel: string;
        subsLanguage: string;
    };
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
    tracks?: TrackInstance[];
    textTrackStyle?: Record<string, unknown>;
}

interface LoadRequestInstance {
    activeTrackIds?: number[];
}

interface TrackInstance {
    trackContentId?: string;
    trackContentType?: string;
    subtype?: string;
    name?: string;
    language?: string;
    customData?: unknown;
}

interface CastWindow extends Window {
    cast?: {
        framework: {
            CastContext: {
                getInstance: () => {
                    setOptions: (options: {
                        receiverApplicationId: string;
                        autoJoinPolicy: string;
                    }) => void;
                    getCurrentSession: () => CastSession | null;
                    requestSession: () => Promise<void>;
                };
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
                Track: new (
                    trackId: number,
                    trackType: string
                ) => TrackInstance;
                TrackType: {
                    TEXT: string;
                    AUDIO: string;
                    VIDEO: string;
                };
                TextTrackType: {
                    SUBTITLES: string;
                    CAPTIONS: string;
                };
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

const getMediaConfig = (src: string) => {
    if (src.includes(".m3u8")) {
        return {
            contentType: "application/x-mpegURL",
            streamType: "BUFFERED",
        };
    }
    if (src.includes(".mpd")) {
        return {
            contentType: "application/dash+xml",
            streamType: "BUFFERED",
        };
    }
    return {
        contentType: "video/mp4",
        streamType: "BUFFERED",
    };
};

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
            if (!win.cast?.framework || !win.chrome?.cast) return;
            try {
                const context = win.cast.framework.CastContext.getInstance();
                context.setOptions({
                    receiverApplicationId: DEFAULT_RECEIVER_APP_ID,
                    autoJoinPolicy:
                        win.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
                });

                remotePlayerRef.current = new win.cast.framework.RemotePlayer();
                remoteControllerRef.current =
                    new win.cast.framework.RemotePlayerController(
                        remotePlayerRef.current
                    );

                setCastReady(true);
            } catch {
                // Ignore initialization errors if already initialized
            }
        };

        if (win.cast?.framework && win.chrome?.cast) {
            initCast();
            return;
        }

        const prevCallback = win.__onGCastApiAvailable;
        win.__onGCastApiAvailable = (isAvailable: boolean) => {
            if (prevCallback && typeof prevCallback === "function") {
                try {
                    prevCallback(isAvailable);
                } catch {
                    // Ignore previous callback error
                }
            }
            if (isAvailable) {
                initCast();
            }
        };
    }, []);

    const loadMedia = useCallback(async () => {
        const win = window as unknown as CastWindow;
        if (!win.cast?.framework || !win.chrome?.cast) return;
        const context = win.cast.framework.CastContext.getInstance();
        const session = context.getCurrentSession();

        if (!session) return;

        const { contentType, streamType } = getMediaConfig(videoSrc);

        const mediaInfo = new win.chrome.cast.media.MediaInfo(
            videoSrc,
            contentType
        );

        mediaInfo.streamType = streamType;

        if (subtitleSrc && metadata) {
            const track = new win.chrome.cast.media.Track(
                1,
                win.chrome.cast.media.TrackType.TEXT
            );
            track.trackContentId = subtitleSrc;
            track.trackContentType = "text/vtt";
            track.subtype = win.chrome.cast.media.TextTrackType.SUBTITLES;
            track.name = metadata.subsLabel;
            track.language = metadata.subsLanguage;
            track.customData = null;

            mediaInfo.tracks = [track];
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
            if (!win.cast?.framework) {
                throw new Error("Chromecast Cast API not available yet");
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
