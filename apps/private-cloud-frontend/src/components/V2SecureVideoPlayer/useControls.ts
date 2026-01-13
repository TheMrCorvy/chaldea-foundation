import { NasApiRoutes } from "@/utils/routes";
import { LanguagesInfo } from "@repo/type-definitions";
import { useEffect, useMemo, useRef, useState } from "react";

interface UseControlsProps {
    languagesInfo: LanguagesInfo;
    nasBaseUrl: string;
    apiKey: string;
    fileType: string;
    path: string;
    display_name: string;
}

const useControls = ({
    languagesInfo,
    apiKey,
    nasBaseUrl,
    fileType,
    path,
    display_name,
}: UseControlsProps) => {
    const [audioIndex, setAudioIndex] = useState(
        languagesInfo?.audioTracks?.[0]?.trackIndex ?? 0
    );
    const [subtitleIndex, setSubtitleIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const duration = languagesInfo?.duration || 0;
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [vtt, setVtt] = useState<string | null>(null);
    // When the user seeks or changes tracks, remember whether the player was
    // playing so we can resume playback automatically once the new source is ready.
    const seekShouldPlayRef = useRef(false);

    const [start, setStart] = useState(0);

    const videoSrc = useMemo(() => {
        let url = `${nasBaseUrl}${NasApiRoutes.V2_STREAM_MEDIA}?fileType=${fileType}&parentDirectory=${encodeURIComponent(
            path
        )}&fileName=${encodeURIComponent(
            display_name
        )}&apiKey=${encodeURIComponent(apiKey)}&audioIndex=${audioIndex}`;

        if (start > 0) {
            url += `&start=${start}`;
        }

        return url;
    }, [apiKey, display_name, fileType, nasBaseUrl, path, audioIndex, start]);

    // Update current time using 'timeupdate' event instead of polling.
    // This avoids a race where the periodic interval can read a transient
    // currentTime of 0 immediately after the <video> src is changed.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(start + video.currentTime);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [start]);

    // Keep `isPlaying` in sync with the video element's play/pause events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);

        return () => {
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
        };
    }, []);

    // Manage loading state (waiting/canplay/playing/error) and set loading when source changes
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onWaiting = () => setIsLoading(true);
        const onPlaying = () => setIsLoading(false);
        const onCanPlay = () => {
            setIsLoading(false);
            // If a seek or track change requested an automatic resume, try to play.
            if (seekShouldPlayRef.current && video) {
                // Attempt to play and keep loading indicator until playback starts.
                const playPromise = video.play();
                setIsLoading(true);
                if (playPromise && typeof playPromise.then === "function") {
                    playPromise.catch(() => setIsLoading(false));
                }
                setIsPlaying(true);
                seekShouldPlayRef.current = false;
            }
        };
        const onError = () => {
            setIsLoading(false);
            seekShouldPlayRef.current = false;
        };

        video.addEventListener("waiting", onWaiting);
        video.addEventListener("playing", onPlaying);
        video.addEventListener("canplay", onCanPlay);
        video.addEventListener("error", onError);

        return () => {
            video.removeEventListener("waiting", onWaiting);
            video.removeEventListener("playing", onPlaying);
            video.removeEventListener("canplay", onCanPlay);
            video.removeEventListener("error", onError);
        };
    }, [videoSrc]);

    // Handle play/pause click
    const handlePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsLoading(false);
            setIsPlaying(false);
        } else {
            // play() returns a promise; mark loading until playing/canplay fires
            const promise = videoRef.current.play();
            setIsLoading(true);
            // if play fails, stop loading
            if (promise && typeof promise.then === "function") {
                promise.catch(() => setIsLoading(false));
            }
            setIsPlaying(true);
        }

        setShowControls(true);
        resetControlsTimeout();
    };

    // Handle fullscreen button click
    const handleFullscreenClick = () => {
        if (videoRef.current?.parentElement) {
            if (!document.fullscreenElement) {
                return videoRef.current.parentElement.requestFullscreen();
            }
            document.exitFullscreen();
        }
        resetControlsTimeout();
    };

    // Reset controls visibility timeout
    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(true);

        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    // Handle mouse move to show controls
    const handleMouseMove = () => {
        resetControlsTimeout();
    };

    // Handle progress bar change
    const handleProgressChange = (value: number | number[]) => {
        const newTime = Array.isArray(value) ? value[0] : value;
        const wasPlaying = isPlaying;
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            setStart(newTime);
            setIsLoading(true);
            // If the user was watching when they sought, resume automatically when ready.
            seekShouldPlayRef.current = wasPlaying;
        }
    };

    // Handle audio selection change
    const handleAudioChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            const wasPlaying = isPlaying;
            setAudioIndex(Number(newValue) as number);
            setStart(currentTime);
            setIsLoading(true);
            seekShouldPlayRef.current = wasPlaying;
        }
    };

    const subtitleSrcUrl = (subsIndex: number) => {
        if (
            subsIndex < 0 ||
            !languagesInfo?.subtitleTracks ||
            subsIndex >= languagesInfo.subtitleTracks.length
        ) {
            return null;
        }

        return `${nasBaseUrl}${NasApiRoutes.V2_SERVE_SUBTITLES}?parentDirectory=${encodeURIComponent(
            path
        )}&fileName=${encodeURIComponent(
            display_name
        )}&apiKey=${encodeURIComponent(apiKey)}&subtitleIndex=${subsIndex}`;
    };

    // Handle subtitle selection change
    const handleSubtitleChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            const subtitleSrc = subtitleSrcUrl(Number(newValue));
            const wasPlaying = isPlaying;

            setSubtitleIndex(Number(newValue) as number);
            setStart(currentTime);
            setIsLoading(true);

            seekShouldPlayRef.current = wasPlaying;

            if (subtitleSrc) {
                fetch(subtitleSrc)
                    .then((res) => res.text())
                    .then((result) => {
                        setIsLoading(false);
                        setVtt(result);
                    });
            }
        }
    };

    // Handle volume change
    const handleVolumeChange = (value: number | number[]) => {
        const newVolume = Array.isArray(value) ? value[0] : value;
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    // Handle volume slider mouse enter
    const handleVolumeMouseEnter = () => {
        setShowVolumeSlider(true);
        if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
        }
    };

    // Handle volume slider mouse leave
    const handleVolumeMouseLeave = () => {
        if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
        }
        volumeTimeoutRef.current = setTimeout(() => {
            setShowVolumeSlider(false);
        }, 300);
    };

    return {
        videoRef,
        videoSrc,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        showControls,
        audioIndex,
        subtitleIndex,
        volume,
        showVolumeSlider,
        handlePlayPause,
        handleFullscreenClick,
        handleMouseMove,
        handleProgressChange,
        handleAudioChange,
        handleSubtitleChange,
        handleVolumeChange,
        handleVolumeMouseEnter,
        handleVolumeMouseLeave,
        vtt,
        subtitleSrcUrl,
    };
};

export default useControls;
