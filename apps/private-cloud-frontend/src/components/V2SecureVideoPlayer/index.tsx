"use client";

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
    CircularProgress,
} from "@mui/joy";
import { FC } from "react";
import { getScreenSize } from "@/utils/screenSize";
import PrevNextEpisode from "../PrevNextEpisode";
import { LanguagesInfo } from "@repo/type-definitions";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { formatTime } from "@repo/shared-utils/format-time";

import useControls from "./useControls";
import useStyles from "./useStyles";

export interface V2SecureVideoPlayerProps {
    fileType: string;
    display_name: string;
    path: string;
    languages_info: LanguagesInfo;
    documentId: string;
    parent: string;
    apiKey: string;
    nasBaseUrl: string;
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
}) => {
    const {
        handleAudioChange,
        videoRef,
        handleFullscreenClick,
        handleMouseMove,
        videoSrc,
        handlePlayPause,
        isPlaying,
        isLoading,
        showControls,
        currentTime,
        duration,
        handleProgressChange,
        subtitleIndex,
        audioIndex,
        handleSubtitleChange,
        volume,
        showVolumeSlider,
        handleVolumeChange,
        handleVolumeMouseEnter,
        handleVolumeMouseLeave,
    } = useControls({
        fileType,
        display_name,
        path,
        languagesInfo: languages_info,
        apiKey,
        nasBaseUrl,
    });

    const { root } = useStyles();

    return (
        <Card variant="soft" sx={root}>
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
                    onDoubleClick={handleFullscreenClick}
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
                        onClick={handlePlayPause}
                    >
                        Tu navegador no soporta la reproducción de videos.
                    </video>

                    {/* Center Play Button / Loader */}
                    {!isPlaying && showControls && !isLoading && (
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

                    {isLoading && showControls && (
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
                            }}
                        >
                            <CircularProgress
                                size="md"
                                sx={{ color: "white" }}
                            />
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

                                    {/* Volume Control */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                        onMouseEnter={handleVolumeMouseEnter}
                                        onMouseLeave={handleVolumeMouseLeave}
                                    >
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVolumeChange(
                                                    volume === 0 ? 1 : 0
                                                );
                                            }}
                                            sx={{
                                                width: 36,
                                                height: 36,
                                            }}
                                            variant="plain"
                                        >
                                            {volume === 0 ? (
                                                <VolumeOffIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: "white",
                                                    }}
                                                />
                                            ) : (
                                                <VolumeUpIcon
                                                    sx={{
                                                        fontSize: 20,
                                                        color: "white",
                                                    }}
                                                />
                                            )}
                                        </IconButton>

                                        {/* Volume Slider */}
                                        {showVolumeSlider && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    animation:
                                                        "slideInVolume 0.2s ease-in-out",
                                                    "@keyframes slideInVolume":
                                                        {
                                                            "0%": {
                                                                opacity: 0,
                                                                width: "0px",
                                                            },
                                                            "100%": {
                                                                opacity: 1,
                                                                width: "80px",
                                                            },
                                                        },
                                                    width: "80px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <Slider
                                                    value={volume}
                                                    onChange={(e, value) =>
                                                        handleVolumeChange(
                                                            value
                                                        )
                                                    }
                                                    min={0}
                                                    max={1}
                                                    step={0.1}
                                                    sx={{
                                                        "--Slider-trackSize":
                                                            "3px",
                                                        "--Slider-thumbSize":
                                                            "12px",
                                                        "--Slider-thumb-shadow":
                                                            "0 0 0 6px",
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>

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
                                            value={track.trackIndex}
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
                                            value={track.trackIndex}
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
