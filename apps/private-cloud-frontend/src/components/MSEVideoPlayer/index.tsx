"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";

const SEGMENT_DURATION = 20;

export interface MSEVideoPlayerProps {
    apiKey: string;
}

export default function MSEVideoPlayer({ apiKey }: MSEVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaSourceRef = useRef<MediaSource | null>(null);
    const intervalRef = useRef<number | null>(null);

    const [started, setStarted] = useState(false);
    const [audioTrack, setAudioTrack] = useState(0);

    useEffect(() => {
        if (!started) return;

        const video = videoRef.current;
        if (!video) return;

        // Hard reset video element
        video.pause();
        video.removeAttribute("src");
        video.load();

        const mediaSource = new MediaSource();
        mediaSourceRef.current = mediaSource;

        video.src = URL.createObjectURL(mediaSource);

        const onSourceOpen = async () => {
            const sourceBuffer = mediaSource.addSourceBuffer(
                'video/mp4; codecs="avc1.640028, mp4a.40.2"'
            );

            const waitForUpdateEnd = () =>
                new Promise<void>((resolve) => {
                    sourceBuffer.addEventListener(
                        "updateend",
                        () => resolve(),
                        {
                            once: true,
                        }
                    );
                });

            /* -------------------------------------------------
         1. INIT SEGMENT (ALWAYS FROM TIME 0)
      ------------------------------------------------- */
            const initRes = await fetch(
                `http://localhost:3030/api/mse/init?audio=${audioTrack}&apiKey=${apiKey}`
            );
            const initBuffer = await initRes.arrayBuffer();

            sourceBuffer.appendBuffer(initBuffer);
            await waitForUpdateEnd();

            /* -------------------------------------------------
         2. MEDIA SEGMENTS
      ------------------------------------------------- */
            let start = 0;

            const appendSegment = async () => {
                const res = await fetch(
                    `http://localhost:3030/api/mse/segment?start=${start}&duration=${SEGMENT_DURATION}&audio=${audioTrack}&apiKey=${apiKey}`
                );

                const buffer = await res.arrayBuffer();

                sourceBuffer.appendBuffer(buffer);
                await waitForUpdateEnd();

                start += SEGMENT_DURATION;
            };

            // Prime buffer
            await appendSegment();
            await appendSegment();

            // Start playback (legal: user clicked)
            await video.play();

            // Naive sliding window loader
            intervalRef.current = window.setInterval(async () => {
                if (
                    mediaSource.readyState === "open" &&
                    sourceBuffer.buffered.length > 0 &&
                    video.currentTime >
                        sourceBuffer.buffered.end(0) - SEGMENT_DURATION
                ) {
                    await appendSegment();
                }
            }, 1000);
        };

        mediaSource.addEventListener("sourceopen", onSourceOpen);

        return () => {
            mediaSource.removeEventListener("sourceopen", onSourceOpen);

            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            mediaSourceRef.current = null;
        };
    }, [started, audioTrack, apiKey]);

    return (
        <Box sx={{ maxWidth: 720, mx: "auto", mt: 4 }}>
            <Typography level="h4" sx={{ mb: 2 }}>
                MSE Video PoC
            </Typography>

            <video
                ref={videoRef}
                controls
                style={{ width: "100%", backgroundColor: "black" }}
            />

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button onClick={() => setStarted(true)} disabled={started}>
                    Play
                </Button>

                <Select
                    value={audioTrack}
                    onChange={(_, value) => {
                        if (value !== null) {
                            setStarted(false); // force clean restart
                            setAudioTrack(value);
                            setTimeout(() => setStarted(true), 0);
                        }
                    }}
                    sx={{ width: 200 }}
                >
                    <Option value={0}>Audio 0</Option>
                    <Option value={1}>Audio 1</Option>
                </Select>
            </Box>
        </Box>
    );
}
