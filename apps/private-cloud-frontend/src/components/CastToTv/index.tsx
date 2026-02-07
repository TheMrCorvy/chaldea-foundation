import { FC, useCallback, useEffect, useRef, useState } from "react";
import IconButton from "@mui/joy/IconButton";
import CastIcon from "@mui/icons-material/Cast";

export interface CastToTvProps {
    videoSrc: string;
    subtitleSrc?: string;
    metadata?: {
        subsLanguage: string;
        subsLabel: string;
    };
}

interface CastWindow extends Window {
    cast?: any;
    chrome?: any;
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
}

const DEFAULT_RECEIVER_APP_ID = "CC1AD845";

/**
 * Detect content type & stream type based on URL
 * Enables HLS/DASH buffering when infrastructure allows it
 */
const getMediaConfig = (src: string) => {
    if (src.endsWith(".m3u8")) {
        return {
            contentType: "application/x-mpegURL",
            streamType: "BUFFERED",
        };
    }

    if (src.endsWith(".mpd")) {
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

const CastToTv: FC<CastToTvProps> = ({ videoSrc, subtitleSrc, metadata }) => {
    const [castReady, setCastReady] = useState(false);
    const [casting, setCasting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remotePlayerRef = useRef<any>(null);
    const remoteControllerRef = useRef<any>(null);

    const canCast =
        !!videoSrc &&
        ((!subtitleSrc && !metadata) || (!!subtitleSrc && !!metadata));

    /** Initialize Cast SDK */
    useEffect(() => {
        const win = window as CastWindow;

        const initCast = () => {
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

    /** Load media into Chromecast */
    const loadMedia = useCallback(async () => {
        const win = window as CastWindow;
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

    /** Main Cast Button Handler */
    const handleCast = useCallback(async () => {
        setError(null);
        setCasting(true);

        try {
            const win = window as CastWindow;
            const context = win.cast.framework.CastContext.getInstance();
            let session = context.getCurrentSession();

            // No session → request one
            if (!session) {
                await context.requestSession();
                session = context.getCurrentSession();
            }

            if (!session) return;

            const mediaSession = session.getMediaSession();

            // Already casting → toggle play/pause
            if (mediaSession && remoteControllerRef.current) {
                remoteControllerRef.current.playOrPause();
                return;
            }

            // Otherwise load media
            await loadMedia();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Chromecast error");
        } finally {
            setCasting(false);
        }
    }, [loadMedia]);

    return (
        <>
            {castReady && canCast && (
                <IconButton
                    disabled={!castReady || casting}
                    loading={casting}
                    onClick={handleCast}
                    sx={{ width: 36, height: 36 }}
                >
                    <CastIcon sx={{ fontSize: 20, color: "white" }} />
                </IconButton>
            )}

            {error && (
                <span style={{ color: "red", marginLeft: 8 }}>{error}</span>
            )}
        </>
    );
};

export default CastToTv;
