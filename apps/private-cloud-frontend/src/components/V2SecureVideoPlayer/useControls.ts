import { NasApiRoutes } from "@/utils/routes";
import { LanguagesInfo } from "@repo/type-definitions";
import { useEffect, useRef, useState } from "react";

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
    const duration = languagesInfo?.duration || 0;
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const videoSrc = `${nasBaseUrl}${NasApiRoutes.V2_STREAM_MEDIA}/${fileType}?parentDirectory=${path}&fileName=${display_name}&apiKey=${apiKey}&audioIndex=${audioIndex}&subtitleIndex=${subtitleIndex}`;

    // Update progress every second when playing
    useEffect(() => {
        if (!isPlaying || !videoRef.current) return;

        const interval = setInterval(() => {
            if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

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
        }
    };

    // Handle audio selection change
    const handleAudioChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            setAudioIndex(Number(newValue) as number);
        }
    };

    // Handle subtitle selection change
    const handleSubtitleChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            setSubtitleIndex(Number(newValue) as number);
        }
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
        handlePlayPause,
        handleFullscreenClick,
        handleMouseMove,
        handleProgressChange,
        handleAudioChange,
        handleSubtitleChange,
    };
};

export default useControls;
