import { useCallback, useEffect, useRef, useState } from "react";
import { LanguagesInfo } from "@repo/type-definitions";
import { getLanguageInfo } from "@repo/shared-utils/language-utils";

export interface UseCastPlaylistProps {
    fileName: string;
    fileType: string;
    parentDirectory: string;
    languagesInfo: LanguagesInfo | null;
    apiKey: string;
    nasBaseUrl: string;
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

export const useCastPlaylist = ({
    fileName,
    fileType,
    parentDirectory,
    languagesInfo,
    apiKey,
    nasBaseUrl,
}: UseCastPlaylistProps) => {
    const [castReady, setCastReady] = useState(false);
    const [casting, setCasting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remotePlayerRef = useRef<unknown>(null);
    const remoteControllerRef = useRef<RemotePlayerControllerInstance | null>(
        null
    );

    // Compute default indices
    const audioIndex = (() => {
        if (!languagesInfo?.audioTracks) return 0;
        const jpnTrack = languagesInfo.audioTracks.find(
            (track) => track.language?.toLowerCase() === "jpn"
        );
        if (jpnTrack) return jpnTrack.trackIndex;
        const unknownTrack = languagesInfo.audioTracks.find(
            (track) => track.language?.toLowerCase() === "unknown"
        );
        if (unknownTrack) return unknownTrack.trackIndex;
        return languagesInfo.audioTracks[0]?.trackIndex ?? 0;
    })();

    const subtitleIndex = (() => {
        if (!languagesInfo?.audioTracks || !languagesInfo?.subtitleTracks)
            return -1;
        const jpnTrack = languagesInfo.audioTracks.find(
            (track) => track.language?.toLowerCase() === "jpn"
        );
        const unknownTrack = languagesInfo.audioTracks.find(
            (track) => track.language?.toLowerCase() === "unknown"
        );
        const defaultAudioTrack =
            jpnTrack || unknownTrack || languagesInfo.audioTracks[0];
        const defaultAudioLang = defaultAudioTrack?.language?.toLowerCase();

        if (defaultAudioLang === "jpn" || defaultAudioLang === "unknown") {
            const espSubtitle = languagesInfo.subtitleTracks.find((track) => {
                const l = track.language?.toLowerCase();
                return l === "esp" || l === "spa" || l === "es";
            });
            if (espSubtitle) return espSubtitle.trackIndex;
        }
        return -1;
    })();

    // Construct media URLs
    const videoSrc = `${nasBaseUrl}/api/v3/serve-episode/playlist.m3u8?parentDirectory=${encodeURIComponent(
        parentDirectory
    )}&fileName=${encodeURIComponent(fileName)}&fileType=${fileType}&audioIndex=${audioIndex}&apiKey=${encodeURIComponent(apiKey)}`;

    const subtitleSrc =
        subtitleIndex !== -1
            ? `${nasBaseUrl}/api/v2/serve-episode/subtitles?parentDirectory=${encodeURIComponent(
                  parentDirectory
              )}&fileName=${encodeURIComponent(fileName)}&apiKey=${encodeURIComponent(apiKey)}&subtitleIndex=${subtitleIndex}`
            : undefined;

    const subtitleMetadata = (() => {
        if (
            subtitleIndex !== -1 &&
            languagesInfo?.subtitleTracks?.[subtitleIndex]
        ) {
            const track = languagesInfo.subtitleTracks[subtitleIndex];
            const languageInfo = getLanguageInfo(track.language, {
                code2: true,
                nameSpanish: true,
            });
            return {
                subsLabel:
                    languageInfo?.nameSpanish || track.language || "Spanish",
                subsLanguage: languageInfo?.code2 || track.language || "es",
            };
        }
        return undefined;
    })();

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

        if (subtitleSrc && subtitleMetadata) {
            mediaInfo.tracks = [
                {
                    trackId: 1,
                    type: "TEXT",
                    trackContentId: subtitleSrc,
                    trackContentType: "text/vtt",
                    subtype: "SUBTITLES",
                    name: subtitleMetadata.subsLabel,
                    language: subtitleMetadata.subsLanguage,
                    customData: null,
                },
            ];
            mediaInfo.textTrackStyle = {};
        }

        const request = new win.chrome.cast.media.LoadRequest(mediaInfo);

        if (subtitleSrc && subtitleMetadata) {
            request.activeTrackIds = [1];
        }

        await session.loadMedia(request);
    }, [videoSrc, subtitleSrc, subtitleMetadata]);

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
