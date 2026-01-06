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
    const [subtitleIndex, setSubtitleIndex] = useState(
        languagesInfo?.subtitleTracks?.[0]?.trackIndex ?? 0
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const duration = languagesInfo?.duration || 0;
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [start, setStart] = useState(0);

    const videoSrc = useMemo(() => {
        let url = `${nasBaseUrl}${NasApiRoutes.V2_STREAM_MEDIA}/${fileType}?parentDirectory=${encodeURIComponent(
            path
        )}&fileName=${encodeURIComponent(
            display_name
        )}&apiKey=${encodeURIComponent(
            apiKey
        )}&audioIndex=${audioIndex}&subtitleIndex=${subtitleIndex}`;

        if (start > 0) {
            url += `&start=${start}`;
        }

        return url;
    }, [
        apiKey,
        display_name,
        fileType,
        nasBaseUrl,
        path,
        audioIndex,
        subtitleIndex,
        start,
    ]);

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

    // Handle play/pause click
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
            setShowControls(true);
            resetControlsTimeout();
        }
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
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            setStart(newTime);
        }
    };

    // Handle audio selection change
    const handleAudioChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            setAudioIndex(Number(newValue) as number);
            setStart(currentTime);
        }
    };

    // Handle subtitle selection change
    const handleSubtitleChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            setSubtitleIndex(Number(newValue) as number);
            setStart(currentTime);
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
    };
};

export default useControls;
