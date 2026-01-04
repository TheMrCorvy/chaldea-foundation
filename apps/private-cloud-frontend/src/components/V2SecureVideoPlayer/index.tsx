"use client";

import { NasApiRoutes } from "@/utils/routes";
import {
    Box,
    Card,
    CardContent,
    CardOverflow,
    Option,
    Select,
    Stack,
    Typography,
    IconButton,
    Slider,
} from "@mui/joy";
import { FC, useState, useRef, useEffect } from "react";
import { getScreenSize } from "@/utils/screenSize";
import PrevNextEpisode from "../PrevNextEpisode";
import { LanguagesInfo } from "@repo/type-definitions";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

export interface V2SecureVideoPlayerProps {
    fileType: string;
    display_name: string;
    path: string;
    languages_info: LanguagesInfo;
    documentId: string;
    parent: string;
    apiKey: string;
    nasBaseUrl: string;
    // enableProxy?: boolean;
}

const V2SecureVideoPlayer: FC<V2SecureVideoPlayerProps> = ({
    fileType,
    display_name,
    path,
    languages_info,
    documentId,
    parent,
    apiKey,
    nasBaseUrl,
    // enableProxy = false,
}) => {
    const [audioIndex, setAudioIndex] = useState(
        languages_info?.audioTracks?.[0]?.globalIndex ?? 0
    );
    const [subtitleIndex, setSubtitleIndex] = useState(
        languages_info?.subtitleTracks?.[0]?.globalIndex ?? 0
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const duration = languages_info?.duration || 0;
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
            resetControlsTimeout();
        }
    };

    // Handle video click to play/pause
    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
        setShowControls(true);
        resetControlsTimeout();
    };

    // Handle double click for fullscreen
    const handleDoubleClick = () => {
        if (videoRef.current?.parentElement) {
            if (!document.fullscreenElement) {
                videoRef.current.parentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
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
            const trackIndex = Array.isArray(newValue) ? newValue[0] : newValue;
            setAudioIndex(Number(trackIndex) as number);
        }
    };

    // Handle subtitle selection change
    const handleSubtitleChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            const trackIndex = Array.isArray(newValue) ? newValue[0] : newValue;
            setSubtitleIndex(Number(trackIndex) as number);
        }
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <Card
            variant="soft"
            sx={{
                background: "neutral.900",
                borderRadius: 20,
                "--Card-padding": {
                    xs: "8px",
                    md: "16px",
                },
                "--Card-radius": "20px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            }}
        >
            <CardContent
                sx={{
                    gap: 1,
                    pb: 1,
                    zIndex: 0,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        backgroundColor: "#000",
                        border: "1px solid",
                        borderColor: "neutral.200",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onMouseMove={handleMouseMove}
                    onDoubleClick={handleDoubleClick}
                >
                    <video
                        ref={videoRef}
                        width="800"
                        style={{
                            width: "100%",
                            display: "block",
                            aspectRatio: "16/9",
                        }}
                        src={videoSrc}
                        preload="auto"
                        onClick={handleVideoClick}
                    >
                        Tu navegador no soporta la reproducción de videos.
                    </video>

                    {/* Center Play Button */}
                    {!isPlaying && showControls && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: {
                                    xs: "40%",
                                    md: "50%",
                                },
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 10,
                                animation: "fadeInScale 0.2s ease-in",
                                "@keyframes fadeInScale": {
                                    "0%": {
                                        opacity: 0,
                                        transform:
                                            "translate(-50%, -50%) scale(0.8)",
                                    },
                                    "100%": {
                                        opacity: 1,
                                        transform:
                                            "translate(-50%, -50%) scale(1)",
                                    },
                                },
                            }}
                        >
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayPause();
                                }}
                                sx={{
                                    width: {
                                        xs: 20,
                                        md: 80,
                                    },
                                    height: {
                                        xs: 20,
                                        md: 80,
                                    },
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    },
                                }}
                            >
                                <PlayArrowIcon
                                    sx={{
                                        fontSize: {
                                            xs: 25,
                                            md: 50,
                                        },
                                        color: "white",
                                    }}
                                />
                            </IconButton>
                        </Box>
                    )}

                    {/* Progress Bar and Bottom Controls Container */}
                    {showControls && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background:
                                    "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                                padding: "20px 16px 12px 16px",
                                zIndex: 10,
                            }}
                        >
                            {/* Progress Bar */}
                            <Box sx={{ mb: 1 }}>
                                <Slider
                                    // value={secondsToTime(Number(currentTime))}
                                    value={currentTime}
                                    onChange={(e, value) =>
                                        handleProgressChange(value)
                                    }
                                    min={0}
                                    max={duration || 0}
                                    step={0.1}
                                    sx={{
                                        "--Slider-trackSize": "4px",
                                        "--Slider-thumbSize": "14px",
                                        "--Slider-thumb-shadow": "0 0 0 8px",
                                    }}
                                />
                            </Box>

                            {/* Bottom Controls */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {/* Left Side: Play/Pause and Time */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayPause();
                                        }}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                        }}
                                    >
                                        {isPlaying ? (
                                            <PauseIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: "white",
                                                }}
                                            />
                                        ) : (
                                            <PlayArrowIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: "white",
                                                }}
                                            />
                                        )}
                                    </IconButton>
                                    <Typography
                                        sx={{
                                            color: "white",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {formatTime(currentTime)} /{" "}
                                        {formatTime(duration || 0)}
                                    </Typography>
                                </Box>

                                {/* Right Side: Fullscreen */}
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFullscreenClick();
                                    }}
                                    sx={{
                                        width: 36,
                                        height: 36,
                                    }}
                                >
                                    <FullscreenIcon
                                        sx={{
                                            fontSize: 20,
                                            color: "white",
                                        }}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                </Box>
            </CardContent>
            <CardOverflow
                variant="solid"
                sx={{
                    backgroundColor: "#0B6BCB",
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        py: 2,
                        gap: 2,
                        zIndex: 0,
                        [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                            flexDirection: "column",
                            gap: 3,
                        },
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                                width: "100%",
                                justifyContent: "center",
                            },
                        }}
                    >
                        <Box sx={{ minWidth: 100 }}>
                            <Typography
                                level="body-xs"
                                fontWeight="bold"
                                sx={{
                                    textAlign: "left",
                                    mb: 0.5,
                                    color: "white",
                                    paddingLeft: 0.5,
                                }}
                            >
                                Idioma
                            </Typography>
                            <Select
                                value={audioIndex}
                                onChange={handleAudioChange}
                                slotProps={{
                                    listbox: {
                                        placement: "bottom-start",
                                        sx: { minWidth: 160 },
                                    },
                                }}
                                variant="soft"
                                size="sm"
                            >
                                {languages_info.audioTracks?.map(
                                    (track, index) => (
                                        <Option
                                            key={index}
                                            value={track.globalIndex}
                                        >
                                            {track.language}
                                        </Option>
                                    )
                                )}
                            </Select>
                        </Box>
                        <Box sx={{ minWidth: 100 }}>
                            <Typography
                                level="body-xs"
                                fontWeight="bold"
                                sx={{
                                    textAlign: "left",
                                    mb: 0.5,
                                    color: "white",
                                    paddingLeft: 0.5,
                                }}
                            >
                                Subtítulos
                            </Typography>
                            <Select
                                value={subtitleIndex}
                                onChange={handleSubtitleChange}
                                slotProps={{
                                    listbox: {
                                        placement: "bottom-start",
                                        sx: { minWidth: 160 },
                                    },
                                }}
                                variant="soft"
                                size="sm"
                            >
                                {languages_info.subtitleTracks?.map(
                                    (track, index) => (
                                        <Option
                                            key={index}
                                            value={track.globalIndex}
                                        >
                                            {track.language}
                                        </Option>
                                    )
                                )}
                            </Select>
                        </Box>
                    </Stack>

                    <PrevNextEpisode parentId={parent} episodeId={documentId} />
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default V2SecureVideoPlayer;
