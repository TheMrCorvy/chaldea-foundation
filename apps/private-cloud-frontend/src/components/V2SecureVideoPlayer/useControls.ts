import { NasApiRoutes } from "@/utils/routes";
import { logData } from "@repo/shared-utils/log-data";
import { LanguagesInfo, StreamTracks } from "@repo/type-definitions";
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
        // -1 means subtitles OFF
        languagesInfo?.subtitleTracks?.[0]?.trackIndex ?? -1
    );
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
    // When the user seeks or changes tracks, remember whether the player was
    // playing so we can resume playback automatically once the new source is ready.
    const seekShouldPlayRef = useRef(false);

    const [start, setStart] = useState(0);

    // Keep references to dynamically added subtitle track and its blob URL so we
    // can remove and revoke them when switching or unmounting.
    const subtitleTrackElRef = useRef<HTMLTrackElement | null>(null);
    const subtitleBlobUrlRef = useRef<string | null>(null);

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

    // Handle subtitle selection change
    const handleSubtitleChange = (
        _event: React.SyntheticEvent | null,
        newValue: string | number | null
    ) => {
        if (newValue !== null) {
            const wasPlaying = isPlaying;
            setSubtitleIndex(Number(newValue) as number);
            setStart(currentTime);
            setIsLoading(true);
            seekShouldPlayRef.current = wasPlaying;
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

    // Load and attach subtitles when subtitleIndex is changed. If subtitleIndex
    // is -1, disable/hide subtitles. We fetch the VTT file and add a <track>
    // element, revoking the blob URL and removing the element when switching.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Clean previous track if any
        if (subtitleTrackElRef.current) {
            subtitleTrackElRef.current.remove();
            subtitleTrackElRef.current = null;
        }
        if (subtitleBlobUrlRef.current) {
            try {
                URL.revokeObjectURL(subtitleBlobUrlRef.current);
            } catch {
                // ignore
            }
            subtitleBlobUrlRef.current = null;
        }

        // If user selected 'Off', disable text tracks and stop here
        if (subtitleIndex === -1) {
            for (let i = 0; i < video.textTracks.length; i++) {
                video.textTracks[i].mode = "disabled";
            }
            return;
        }

        let cancelled = false;

        const subtitleUrl = `${nasBaseUrl}${NasApiRoutes.V2_SERVE_SUBTITLES}?subtitleIndex=${subtitleIndex}&parentDirectory=${encodeURIComponent(
            path
        )}&fileName=${encodeURIComponent(display_name)}&apiKey=${apiKey}`;

        const selectedSubs = languagesInfo?.subtitleTracks?.find(
            (t) => t.trackIndex === subtitleIndex
        ) as StreamTracks;

        if (selectedSubs === undefined && subtitleIndex !== -1) {
            logData({
                title: "Subtitles were not found",
                type: "error",
                layer: "*",
                data: {
                    selectedSubs,
                    subsInfo: languagesInfo.subtitleTracks,
                    subtitleIndex,
                },
                addSpaceAfter: true,
                addSeparatorAfter: true,
            });

            throw new Error("Subtitle not found.");
        }

        // Fetch the VTT and attach as a blob URL to a <track> element so it's
        // same-origin for the page and we can control cleanup.
        fetch(subtitleUrl)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch subtitles");
                return res.blob();
            })
            .then((blob) => {
                if (cancelled) return;
                const blobUrl = URL.createObjectURL(blob);
                const track = document.createElement("track");
                track.kind = "subtitles";
                track.label = selectedSubs.language;
                track.srclang = selectedSubs.language;
                track.src = blobUrl;
                // Try to make this track the displayed one by default. Some
                // browsers may not immediately expose the TextTrack; prefer to
                // match by label, otherwise pick the most recently added.
                track.default = true;

                const enableMostRecentTextTrack = () => {
                    const tracks = video.textTracks;
                    let chosen: TextTrack | null = null;

                    for (let i = 0; i < tracks.length; i++) {
                        if (tracks[i].label === track.label) {
                            chosen = tracks[i];
                            break;
                        }
                    }

                    if (!chosen && tracks.length > 0) {
                        chosen = tracks[tracks.length - 1];
                    }

                    for (let i = 0; i < tracks.length; i++) {
                        tracks[i].mode =
                            tracks[i] === chosen ? "showing" : "disabled";
                    }

                    // If cues appear to be using absolute timestamps (e.g., large
                    // start times) and the stream itself was started at a later
                    // offset (via ?start=), shift cues backwards by the stream
                    // start so they align with the player's currentTime.
                    try {
                        if (chosen) {
                            const cues = (chosen as TextTrack)
                                .cues as TextTrackCueList | null;
                            if (cues && cues.length > 0) {
                                const firstStart = cues[0].startTime;
                                const videoNow = video.currentTime;

                                // Extract start param from the video's source URL if present
                                let streamStart = 0;
                                try {
                                    const src =
                                        video.currentSrc ||
                                        (video.getAttribute("src") as string) ||
                                        "";
                                    const u = new URL(
                                        src,
                                        window.location.href
                                    );
                                    streamStart =
                                        parseFloat(
                                            u.searchParams.get("start") || "0"
                                        ) || 0;
                                } catch {
                                    streamStart = 0;
                                }

                                // If the first cue is far ahead of the current playhead
                                // but the stream was started at a later offset, shift cues.
                                if (
                                    firstStart > videoNow + 1 &&
                                    streamStart > 0
                                ) {
                                    for (let i = 0; i < cues.length; i++) {
                                        const c = cues[i] as VTTCue;
                                        // adjust safely (startTime/endTime are mutable on modern browsers)
                                        c.startTime = Math.max(
                                            0,
                                            c.startTime - streamStart
                                        );
                                        c.endTime = Math.max(
                                            c.startTime,
                                            c.endTime - streamStart
                                        );
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        // Ignore; this is best-effort debugging/adjustment.
                        console.debug("Adjusting cues failed", err);
                    }
                };

                track.addEventListener("load", enableMostRecentTextTrack);
                video.appendChild(track);

                // In some cases the load event may fire synchronously; ensure we
                // still attempt to enable and adjust the track after appending.
                setTimeout(enableMostRecentTextTrack, 0);

                subtitleTrackElRef.current = track;
                subtitleBlobUrlRef.current = blobUrl;
            })
            .catch((err) => {
                // For now just log. We don't want to crash the player.
                console.error("Failed to load subtitles", err);
            });

        return () => {
            cancelled = true;
            if (subtitleTrackElRef.current) {
                subtitleTrackElRef.current.remove();
                subtitleTrackElRef.current = null;
            }
            if (subtitleBlobUrlRef.current) {
                try {
                    URL.revokeObjectURL(subtitleBlobUrlRef.current);
                } catch {
                    // ignore
                }
                subtitleBlobUrlRef.current = null;
            }
        };
    }, [subtitleIndex, path, display_name, nasBaseUrl, languagesInfo, apiKey]);

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
    };
};

export default useControls;
