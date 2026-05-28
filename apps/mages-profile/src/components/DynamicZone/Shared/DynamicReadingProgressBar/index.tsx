"use client";

import { Box, LinearProgress } from "@mui/material";
import { BlogReadingProgressBar } from "@repo/type-definitions/dynamic-page";
import { FC, useEffect, useMemo, useRef, useState } from "react";

/**
 * Walks up the DOM tree to find the first element that has an explicit
 * overflow auto/scroll style (e.g. StarryContainer's main Box).
 * Returns null when reaching the document root — the caller falls back to
 * window-level scroll in that case.
 */
function getScrollableParent(el: HTMLElement | null): HTMLElement | null {
    if (!el || el === document.documentElement) return null;
    const { overflow, overflowY } = window.getComputedStyle(el);
    if (/auto|scroll/.test(overflow + overflowY)) return el;
    return getScrollableParent(el.parentElement);
}

const DynamicReadingProgressBar: FC<BlogReadingProgressBar> = ({
    position,
    reversed,
    color,
    bar_thickness,
}) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frameId = 0;

        // Detect the nearest scrollable ancestor (e.g. StarryContainer).
        // If none is found, fall back to window / document.documentElement.
        const scrollEl = getScrollableParent(
            sentinelRef.current?.parentElement ?? null
        );

        const computeProgress = () => {
            let scrollTop: number;
            let maxScroll: number;

            if (scrollEl) {
                scrollTop = scrollEl.scrollTop;
                maxScroll = Math.max(
                    scrollEl.scrollHeight - scrollEl.clientHeight,
                    0
                );
            } else {
                const root = document.documentElement;
                scrollTop = window.scrollY || root.scrollTop || 0;
                maxScroll = Math.max(root.scrollHeight - root.clientHeight, 0);
            }

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

        const scrollTarget: EventTarget = scrollEl ?? window;
        scrollTarget.addEventListener("scroll", onScrollOrResize, {
            passive: true,
        });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            scrollTarget.removeEventListener("scroll", onScrollOrResize);
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

    return (
        <>
            {/* Sentinel: always in the DOM so useEffect can locate the
                scrollable ancestor via parentElement traversal. */}
            <div ref={sentinelRef} style={{ display: "none" }} aria-hidden />
            {isVisible && (
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
            )}
        </>
    );
};

export default DynamicReadingProgressBar;
