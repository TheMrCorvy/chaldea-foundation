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
import { CSSProperties, FC } from "react";
import PrevNextEpisode from "../PrevNextEpisode";
import { LanguagesInfo } from "@repo/type-definitions";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { formatTime } from "@repo/shared-utils/format-time";
import { getLanguageInfo } from "@repo/shared-utils/language-utils";

import useControls from "./useControls";
import useStyles from "./useStyles";
import parseVtt from "@/utils/parseVtt";
import CastToTvSelector from "../CastToTv/CastToTvSelector";

export interface V2SecureVideoPlayerProps {
    fileType: string;
    display_name: string;
    path: string;
    languages_info: LanguagesInfo | null;
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
        vtt,
        handleCommitProgressChange,
        hoverTime,
        hoverPosition,
        showHoverTooltip,
        handleTimelineMouseMove,
        handleTimelineMouseEnter,
        handleTimelineMouseLeave,
        handleKeyDown,
        subtitleSrcUrl,
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
        subtitleContainer,
        subtitleSpan,
        timelineTooltip,
        timelineTooltipText,
        navigationWrapper,
    } = useStyles({ showControls });

    const cues = parseVtt(vtt || "");
    const currentCue = cues.find(
        (cue) => currentTime >= cue.start && currentTime <= cue.end
    );
    const subtitleText = currentCue ? currentCue.text : "";

    return (
        <Card variant="soft" sx={root}>
            <CastToTvSelector
                version="V2"
                fileName={display_name}
                fileType={fileType}
                parentDirectory={path}
                languagesInfo={languages_info}
                apiKey={apiKey}
                nasBaseUrl={nasBaseUrl}
                start={currentTime}
                audioIndex={audioIndex}
                subtitleIndex={subtitleIndex}
                subtitleSrcUrl={subtitleSrcUrl}
            />
            <CardContent sx={cardContent}>
                <Box
                    sx={mainBox}
                    onMouseMove={handleMouseMove}
                    onDoubleClick={handleFullscreenClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <video
                        ref={videoRef}
                        width="800"
                        style={videoTag as CSSProperties}
                        src={videoSrc}
                        preload="auto"
                        onClick={handlePlayPause}
                        crossOrigin="anonymous"
                    ></video>

                    {vtt !== null && subtitleText && (
                        <Box sx={subtitleContainer}>
                            <Typography>
                                <span
                                    style={subtitleSpan as CSSProperties}
                                    dangerouslySetInnerHTML={{
                                        __html: subtitleText,
                                    }}
                                ></span>
                            </Typography>
                        </Box>
                    )}

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
                            <Box
                                sx={{ position: "relative", mb: 1 }}
                                onMouseMove={handleTimelineMouseMove}
                                onMouseEnter={handleTimelineMouseEnter}
                                onMouseLeave={handleTimelineMouseLeave}
                            >
                                {showHoverTooltip && (
                                    <Box
                                        style={{ left: hoverPosition }}
                                        sx={timelineTooltip}
                                    >
                                        <Typography sx={timelineTooltipText}>
                                            {formatTime(hoverTime)}
                                        </Typography>
                                    </Box>
                                )}
                                <Slider
                                    value={currentTime}
                                    onChange={(e, value) => {
                                        handleProgressChange(value);
                                    }}
                                    onChangeCommitted={
                                        handleCommitProgressChange
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

                                <div>
                                    {/* <CastToTv
                                        videoSrc={videoSrc}
                                        subtitleSrc={
                                            subtitleSrcUrl(subtitleIndex) ||
                                            undefined
                                        }
                                        metadata={
                                            subtitleIndex !== -1 &&
                                            languages_info?.subtitleTracks?.[
                                                subtitleIndex
                                            ]
                                                ? (() => {
                                                      const track =
                                                          languages_info
                                                              .subtitleTracks![
                                                              subtitleIndex
                                                          ];
                                                      const languageInfo =
                                                          getLanguageInfo(
                                                              track.language,
                                                              {
                                                                  code2: true,
                                                                  nameSpanish: true,
                                                              }
                                                          );

                                                      return {
                                                          subsLabel:
                                                              languageInfo?.nameSpanish ||
                                                              track.language,
                                                          subsLanguage:
                                                              languageInfo?.code2 ||
                                                              track.language,
                                                      };
                                                  })()
                                                : undefined
                                        }
                                    /> */}

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
                                </div>
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
                                {languages_info?.audioTracks?.map(
                                    (track, index) => {
                                        const langInfo = getLanguageInfo(
                                            track.language,
                                            { nameSpanish: true }
                                        );
                                        const displayName =
                                            langInfo?.nameSpanish ||
                                            track.language;
                                        return (
                                            <Option
                                                key={index}
                                                value={track.trackIndex}
                                            >
                                                {displayName}
                                            </Option>
                                        );
                                    }
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

                                {languages_info?.subtitleTracks?.map(
                                    (track, index) => {
                                        const langInfo = getLanguageInfo(
                                            track.language,
                                            { nameSpanish: true }
                                        );
                                        const displayName =
                                            langInfo?.nameSpanish ||
                                            track.language;
                                        return (
                                            <Option
                                                key={index}
                                                value={track.trackIndex}
                                            >
                                                {displayName}
                                            </Option>
                                        );
                                    }
                                )}
                            </Select>
                        </Box>
                    </Stack>

                    <Box sx={navigationWrapper}>
                        <PrevNextEpisode
                            parentId={parent}
                            episodeId={documentId}
                        />
                    </Box>
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default V2SecureVideoPlayer;
