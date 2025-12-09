"use client";

import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { ApiRoutes } from "@/utils/routes";
import {
    Box,
    ButtonGroup,
    Card,
    CardContent,
    CardOverflow,
    IconButton,
    Option,
    Select,
    Slider,
    Stack,
    Typography,
} from "@mui/joy";
import { VideoContainers } from "@repo/type-definitions";
import { FC, useMemo, useRef, useState } from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CastRoundedIcon from "@mui/icons-material/CastRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FolderIcon from "@mui/icons-material/Folder";
import { getScreenSize } from "@/utils/screenSize";

export interface SecureVideoPlayerProps {
    fileType: VideoContainers;
    display_name: string;
    path: string;
    languages_info?: object | null;
    documentId: string;
}

const SecureVideoPlayer: FC<SecureVideoPlayerProps> = ({
    fileType,
    display_name,
    path,
    languages_info,
    documentId,
}) => {
    const filePath = path + "/" + display_name + "." + fileType;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const videoUrl = useMemo(() => {
        // const url = new URL(
        //     "http://localhost:3000" +
        //         ApiRoutes.STREAM_MOCK_EPISODE +
        //         "/" +
        //         documentId
        // );
        const url = new URL(
            "http://localhost:3000" + ApiRoutes.STREAM_MOCK_EPISODE
        );
        url.searchParams.append("filePath", filePath);
        return url.toString();
    }, [filePath]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleRestart = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSliderChange = (_event: Event, value: number | number[]) => {
        const newTime = Array.isArray(value) ? value[0] : value;
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
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
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundColor: "#000",
                        border: "1px solid",
                        borderColor: "neutral.200",
                        transition: "transform 0.2s ease",
                    }}
                >
                    <video
                        ref={videoRef}
                        controls={false}
                        width="800"
                        src={videoUrl}
                        preload="auto"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        style={{
                            width: "100%",
                            display: "block",
                            aspectRatio: "16/9",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            px: 2,
                            pb: 1,
                            background:
                                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                        }}
                    >
                        <Stack spacing={0.5}>
                            <Slider
                                value={currentTime}
                                min={0}
                                max={duration || 100}
                                onChange={handleSliderChange}
                                sx={{
                                    paddingBottom: 0,
                                    color: "#FF5A1F",
                                    "& .MuiSlider-thumb": {
                                        width: 12,
                                        height: 12,
                                        transition: "0.2s ease",
                                        "&:hover, &.Mui-focusVisible": {
                                            boxShadow:
                                                "0 0 0 8px rgba(255, 90, 31, 0.16)",
                                        },
                                    },
                                    "& .MuiSlider-track": {
                                        border: "none",
                                        height: 4,
                                    },
                                    "& .MuiSlider-rail": {
                                        opacity: 0.5,
                                        height: 4,
                                        backgroundColor: "#fff",
                                    },
                                }}
                            />
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{ px: 0.5 }}
                            >
                                <Typography
                                    level="body-xs"
                                    sx={{ color: "white" }}
                                >
                                    {formatTime(currentTime)}
                                </Typography>
                                <Typography
                                    level="body-xs"
                                    sx={{ color: "white" }}
                                >
                                    {formatTime(duration)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        paddingTop: 1.5,
                        paddingBottom: {
                            xs: 1,
                            md: 0,
                        },
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={{
                            xs: 0.5,
                            md: 1,
                            lg: 1.5,
                        }}
                    >
                        <IconButton
                            variant="solid"
                            color="primary"
                            size="lg"
                            onClick={handlePlayPause}
                            sx={{
                                borderRadius: "50%",
                                width: 50,
                                height: 50,
                                background:
                                    "linear-gradient(135deg, #FF5A1F 0%, #E24917 100%)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                    background:
                                        "linear-gradient(135deg, #FF7A45 0%, #FF5A1F 100%)",
                                },
                                "&:active": {
                                    transform: "scale(0.95)",
                                },
                            }}
                        >
                            {isPlaying ? (
                                <PauseRoundedIcon sx={{ fontSize: 28 }} />
                            ) : (
                                <PlayArrowRoundedIcon sx={{ fontSize: 28 }} />
                            )}
                        </IconButton>

                        {/* <IconButton
                            variant="solid"
                            color="neutral"
                            size="lg"
                            onClick={handleRestart}
                            sx={{
                                borderRadius: "50%",
                                width: 50,
                                height: 50,
                                backgroundColor: "neutral.100",
                                transition: "all 0.2s ease",
                                color: "white",
                                "&:hover": {
                                    color: "white",
                                    transform: "scale(1.1)",
                                    backgroundColor: "neutral.200",
                                },
                                "&:active": {
                                    transform: "scale(0.95)",
                                },
                            }}
                        >
                            <PauseRoundedIcon sx={{ fontSize: 28 }} />
                        </IconButton> */}

                        <IconButton
                            variant="solid"
                            color="neutral"
                            size="lg"
                            onClick={handleRestart}
                            sx={{
                                borderRadius: "50%",
                                width: 50,
                                height: 50,
                                backgroundColor: "neutral.100",
                                transition: "all 0.2s ease",
                                color: "white",
                                "&:hover": {
                                    transform: "scale(1.1) rotate(-180deg)",
                                    backgroundColor: "neutral.200",
                                    color: "white",
                                },
                                "&:active": {
                                    transform: "scale(0.95)",
                                },
                            }}
                        >
                            <RestartAltRoundedIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                    </Stack>
                    <IconButton
                        variant="solid"
                        color="neutral"
                        size="lg"
                        onClick={handleFullscreen}
                        sx={{
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            backgroundColor: "neutral.100",
                            transition: "all 0.2s ease",
                            color: "white",
                            "&:hover": {
                                color: "white",
                                transform: "scale(1.1)",
                                backgroundColor: "neutral.200",
                            },
                            "&:active": {
                                transform: "scale(0.95)",
                            },
                        }}
                    >
                        <FullscreenExitIcon sx={{ fontSize: 28 }} />
                    </IconButton>
                </Stack>
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
                                defaultValue="SPA"
                                slotProps={{
                                    listbox: {
                                        placement: "bottom-start",
                                        sx: { minWidth: 160 },
                                    },
                                }}
                                variant="soft"
                                size="sm"
                            >
                                <Option value="ENG">ENG</Option>
                                <Option value="JAP">JAP</Option>
                                <Option value="SPA">SPA</Option>
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
                                defaultValue="SPA"
                                slotProps={{
                                    listbox: {
                                        placement: "bottom-start",
                                        sx: { minWidth: 160 },
                                    },
                                }}
                                variant="soft"
                                size="sm"
                            >
                                <Option value="ENG">ENG</Option>
                                <Option value="JAP">JAP</Option>
                                <Option value="SPA">SPA</Option>
                            </Select>
                        </Box>
                    </Stack>

                    <ButtonGroup
                        variant="solid"
                        aria-label="navigation buttons"
                        sx={{
                            height: 35,
                            width: 350,
                            "& > button:first-of-type": {
                                borderTopLeftRadius: 20,
                                borderBottomLeftRadius: 20,
                            },
                            "& > button:last-of-type": {
                                borderTopRightRadius: 20,
                                borderBottomRightRadius: 20,
                            },
                            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                                width: 215,
                                maxHeight: 30,
                            },
                        }}
                    >
                        <IconButton sx={{ flex: 1 }}>
                            <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>
                        <IconButton sx={{ flex: 1 }}>
                            <FolderIcon fontSize="small" />
                        </IconButton>
                        <IconButton sx={{ flex: 1 }}>
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </ButtonGroup>

                    <IconButton
                        variant="solid"
                        color="success"
                        size="lg"
                        sx={{
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            transition: "all 0.2s ease",
                            backgroundColor: "success.500",
                            border: "none",
                            "&:hover": {
                                transform: "scale(1.1)",
                                backgroundColor: "success.600",
                                "& svg": {
                                    color: "#fff",
                                },
                            },
                            "&:active": {
                                transform: "scale(0.95)",
                            },
                        }}
                    >
                        <CastRoundedIcon />
                    </IconButton>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default SecureVideoPlayer;
