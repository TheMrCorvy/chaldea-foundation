import Hls from "hls.js";
import { NasApiRoutes } from "@/utils/routes";
import { LanguagesInfo } from "@repo/type-definitions";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    KeyboardEvent,
} from "react";

interface UseControlsProps {
    languagesInfo: LanguagesInfo | null;
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
    const [audioIndex, setAudioIndex] = useState(() => {
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
    });

    const [subtitleIndex, setSubtitleIndex] = useState(() => {
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
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hoverTime, setHoverTime] = useState(0);
    const [hoverPosition, setHoverPosition] = useState(0);
    const [showHoverTooltip, setShowHoverTooltip] = useState(false);
    const duration = languagesInfo?.duration || 0;
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [vtt, setVtt] = useState<string | null>(null);
    const [isSliding, setIsSliding] = useState(false);
    const seekShouldPlayRef = useRef(false);
    // Position to restore after an audio track switch triggers an HLS reload.
    const seekToTimeRef = useRef(0);

    const videoSrc = useMemo(() => {
        return `${nasBaseUrl}${NasApiRoutes.V3_PLAYLIST}?fileType=${fileType}&parentDirectory=${encodeURIComponent(
            path
        )}&fileName=${encodeURIComponent(
            display_name
        )}&apiKey=${encodeURIComponent(apiKey)}&audioIndex=${audioIndex}`;
    }, [apiKey, display_name, fileType, nasBaseUrl, path, audioIndex]);

    // Set up hls.js (or native HLS on Safari) whenever the playlist URL changes.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hlsInstance: Hls | null = null;

        if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(videoSrc);
            hlsInstance.attachMedia(video);

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                if (seekToTimeRef.current > 0) {
                    video.currentTime = seekToTimeRef.current;
                    seekToTimeRef.current = 0;
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari supports HLS natively.
            video.src = videoSrc;
            if (seekToTimeRef.current > 0) {
                video.currentTime = seekToTimeRef.current;
                seekToTimeRef.current = 0;
            }
        }

        return () => {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        };
    }, [videoSrc]);

    // Update current time using 'timeupdate' instead of polling.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isSliding) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [isSliding]);

    // Keep `isPlaying` in sync with the video element's play/pause events.
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

    // Manage loading state and auto-resume after an audio track change.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onWaiting = () => setIsLoading(true);
        const onPlaying = () => setIsLoading(false);
        const onCanPlay = () => {
            setIsLoading(false);
            if (seekShouldPlayRef.current && video) {
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

    const handlePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
            setIsLoading(false);
            setIsPlaying(false);
        } else {
            const promise = videoRef.current.play();
            setIsLoading(true);
            if (promise && typeof promise.then === "function") {
                promise.catch(() => setIsLoading(false));
            }
            setIsPlaying(true);
        }

        setShowControls(true);
        resetControlsTimeout();
    };

    const handleFullscreenClick = () => {
        if (videoRef.current?.parentElement) {
            if (!document.fullscreenElement) {
                return videoRef.current.parentElement.requestFullscreen();
            }
            document.exitFullscreen();
        }
        resetControlsTimeout();
    };

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

    const handleMouseMove = () => {
        resetControlsTimeout();
    };

    const handleProgressChange = (value: number | number[]) => {
        const newTime = Array.isArray(value) ? value[0] : value;

        if (videoRef.current) {
            setIsSliding(true);
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // HLS seeks natively; just clear the sliding flag.
    const handleCommitProgressChange = () => {
        setIsSliding(false);
    };

    const handleAudioChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            const wasPlaying = isPlaying;
            seekToTimeRef.current = currentTime;
            setAudioIndex(Number(newValue) as number);
            setIsLoading(true);
            seekShouldPlayRef.current = wasPlaying;
        }
    };

    const subtitleSrcUrl = useCallback(
        (subsIndex: number) => {
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
        },
        [apiKey, display_name, languagesInfo, nasBaseUrl, path]
    );

    // Fetch subtitles automatically when the selected subtitle track changes.
    useEffect(() => {
        if (subtitleIndex === -1) {
            setVtt(null);
            return;
        }

        const subtitleSrc = subtitleSrcUrl(subtitleIndex);
        if (subtitleSrc) {
            setIsLoading(true);
            fetch(subtitleSrc)
                .then((res) => res.text())
                .then((result) => {
                    setIsLoading(false);
                    setVtt(result);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [subtitleIndex, subtitleSrcUrl]);

    // Subtitle changes don't require a video reload; only the VTT needs to change.
    const handleSubtitleChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            setSubtitleIndex(Number(newValue) as number);
        }
    };

    const handleVolumeChange = (value: number | number[]) => {
        const newVolume = Array.isArray(value) ? value[0] : value;
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleVolumeMouseEnter = () => {
        setShowVolumeSlider(true);
        if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
        }
    };

    const handleVolumeMouseLeave = () => {
        if (volumeTimeoutRef.current) {
            clearTimeout(volumeTimeoutRef.current);
        }
        volumeTimeoutRef.current = setTimeout(() => {
            setShowVolumeSlider(false);
        }, 300);
    };

    const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, hoverX / rect.width));
        const calculatedTime = percentage * duration;
        setHoverTime(calculatedTime);
        setHoverPosition(hoverX);
    };

    const handleTimelineMouseEnter = () => {
        setShowHoverTooltip(true);
    };

    const handleTimelineMouseLeave = () => {
        setShowHoverTooltip(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === " " || e.code === "Space") {
            const activeEl = document.activeElement;
            if (
                activeEl &&
                (activeEl.tagName === "INPUT" ||
                    activeEl.tagName === "TEXTAREA" ||
                    activeEl.tagName === "SELECT" ||
                    activeEl.tagName === "BUTTON" ||
                    activeEl.getAttribute("role") === "button" ||
                    activeEl.getAttribute("role") === "combobox" ||
                    activeEl.getAttribute("role") === "listbox" ||
                    activeEl.getAttribute("contenteditable") === "true")
            ) {
                return;
            }
            e.preventDefault();
            handlePlayPause();
        }
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
        handleCommitProgressChange,
        hoverTime,
        hoverPosition,
        showHoverTooltip,
        handleTimelineMouseMove,
        handleTimelineMouseEnter,
        handleTimelineMouseLeave,
        handleKeyDown,
    };
};

export default useControls;
