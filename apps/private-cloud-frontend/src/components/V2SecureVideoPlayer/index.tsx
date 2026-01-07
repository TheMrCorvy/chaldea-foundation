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
    Theme,
} from "@mui/joy";
import { CSSProperties, FC } from "react";
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

    const {
        root,
        cardContent,
        mainBox,
        videoTag,
        playPauseContainer,
        playIconBtn,
        loaderContainer,
        controlsContainer,
        progressBar,
        bottomControlsContainer,
        leftPlayPauseContainer,
        iconBtn,
        volumeSliderContainer,
        volumeSlider,
        currentTimeStyles,
        languageControlsContainer,
        languageControlsStack,
        langTitle,
    } = useStyles();

    return (
        <Card variant="soft" sx={root}>
            <CardContent sx={cardContent}>
                <Box
                    sx={mainBox}
                    onMouseMove={handleMouseMove}
                    onDoubleClick={handleFullscreenClick}
                >
                    <video
                        ref={videoRef}
                        width="800"
                        style={videoTag as CSSProperties}
                        src={videoSrc}
                        preload="auto"
                        onClick={handlePlayPause}
                    >
                        Tu navegador no soporta la reproducción de videos.
                    </video>

                    {/* Center Play Button / Loader */}
                    {!isPlaying && showControls && !isLoading && (
                        <Box sx={playPauseContainer}>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayPause();
                                }}
                                sx={playIconBtn}
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

                    {isLoading && (
                        <Box sx={loaderContainer}>
                            <CircularProgress
                                size="md"
                                sx={{ color: "white" }}
                            />
                        </Box>
                    )}

                    {/* Progress Bar and Bottom Controls Container */}
                    {showControls && (
                        <Box sx={controlsContainer}>
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
                                    sx={progressBar}
                                />
                            </Box>

                            {/* Bottom Controls */}
                            <Box sx={bottomControlsContainer}>
                                {/* Left Side: Play/Pause and Time */}
                                <Box sx={leftPlayPauseContainer}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayPause();
                                        }}
                                        sx={iconBtn}
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
                                        sx={leftPlayPauseContainer}
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
                                            sx={iconBtn}
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
                                            <Box sx={volumeSliderContainer}>
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
                                                    sx={volumeSlider}
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <Typography sx={currentTimeStyles}>
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
                                    sx={iconBtn}
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
                <CardContent sx={languageControlsContainer}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={languageControlsStack}
                    >
                        <Box sx={{ minWidth: 100 }}>
                            <Typography
                                level="body-xs"
                                fontWeight="bold"
                                sx={langTitle}
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
                                sx={langTitle}
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
                                {/* Allow turning subtitles off */}
                                <Option value={-1}>Sin subtítulos</Option>

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
