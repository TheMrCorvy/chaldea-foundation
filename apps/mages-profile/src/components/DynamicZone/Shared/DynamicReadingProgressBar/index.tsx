"use client";

import { Box, LinearProgress } from "@mui/material";
import { ReadingProgressBar } from "@repo/type-definitions/dynamic-page";
import { FC, useEffect, useMemo, useState } from "react";

const DynamicReadingProgressBar: FC<ReadingProgressBar> = ({
    position,
    reversed,
    color,
    bar_thickness,
}) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let frameId = 0;

        const computeProgress = () => {
            const root = document.documentElement;
            const scrollTop = window.scrollY || root.scrollTop || 0;
            const maxScroll = Math.max(
                root.scrollHeight - root.clientHeight,
                0
            );

            if (scrollTop <= 0 || maxScroll <= 0) {
                setProgress(0);
                setIsVisible(false);
                return;
            }

            const normalized = Math.min((scrollTop / maxScroll) * 100, 100);
            const nextProgress = reversed ? 100 - normalized : normalized;

            setProgress(nextProgress);
            setIsVisible(true);
        };

        const onScrollOrResize = () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(computeProgress);
        };

        computeProgress();

        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [reversed]);

    const isVertical = position === "left" || position === "right";

    const resolvedThickness = useMemo(() => {
        if (typeof bar_thickness === "number") {
            return `${bar_thickness}px`;
        }

        if (typeof bar_thickness === "string" && bar_thickness.trim()) {
            return bar_thickness;
        }

        return "6px";
    }, [bar_thickness]);

    const containerSx = useMemo(
        () => ({
            position: "fixed",
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: (theme: { zIndex: { appBar: number } }) =>
                theme.zIndex.appBar + 5,
            opacity: isVisible ? 1 : 0,
            transition: "opacity 180ms ease",
            background:
                "linear-gradient(135deg, rgba(9, 18, 41, 0.45), rgba(8, 58, 109, 0.25))",
            boxShadow:
                "0 0 14px rgba(56, 182, 255, 0.26), inset 0 0 10px rgba(56, 182, 255, 0.12)",
            ...(position === "top" && {
                top: 0,
                left: 0,
                width: "100dvw",
                height: resolvedThickness,
            }),
            ...(position === "bottom" && {
                bottom: 0,
                left: 0,
                width: "100dvw",
                height: resolvedThickness,
            }),
            ...(position === "left" && {
                top: 0,
                left: 0,
                width: resolvedThickness,
                height: "100dvh",
            }),
            ...(position === "right" && {
                top: 0,
                right: 0,
                width: resolvedThickness,
                height: "100dvh",
            }),
        }),
        [isVisible, position, resolvedThickness]
    );

    const progressSx = useMemo(
        () => ({
            width: isVertical ? "100dvh" : "100%",
            height: isVertical ? resolvedThickness : "100%",
            position: isVertical ? "absolute" : "relative",
            top: 0,
            left: 0,
            transform: isVertical
                ? `translateX(${resolvedThickness}) rotate(90deg)`
                : "none",
            transformOrigin: isVertical ? "top left" : "center",
            borderRadius: 0,
            backgroundColor: "rgba(16, 32, 61, 0.55)",
            ".MuiLinearProgress-bar": {
                borderRadius: 0,
                boxShadow:
                    "0 0 14px rgba(125, 211, 252, 0.7), 0 0 20px rgba(56, 182, 255, 0.42)",
                backgroundImage:
                    "linear-gradient(90deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0) 35%)",
                backgroundBlendMode: "screen",
            },
        }),
        [isVertical, resolvedThickness]
    );

    if (!isVisible) {
        return null;
    }

    return (
        <Box sx={containerSx}>
            <LinearProgress
                variant="determinate"
                value={progress}
                color={color}
                sx={progressSx}
                aria-label="Reading progress"
            />
            {isVertical && (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "repeating-linear-gradient(180deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 4px)",
                        mixBlendMode: "screen",
                        opacity: 0.35,
                    }}
                />
            )}
        </Box>
    );
};

export default DynamicReadingProgressBar;
