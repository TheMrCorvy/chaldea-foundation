"use client";

import { JSX, ReactNode } from "react";
import usePixelCard, { UsePixelCardProps } from "./usePixelCard";
import styles from "./PixelCard.module.css";
import { Box } from "@mui/material";

export interface PixelCardProps extends UsePixelCardProps {
    children: ReactNode;
    height?: number | string;
    width?: number | string;
    roundedBorders?: boolean;
}

export default function PixelCard({
    variant = "default",
    gap,
    speed,
    colors,
    noFocus,
    children,
    focusOnMount = false,
    height = "100%",
    width = "100%",
    roundedBorders = true,
    borders,
}: PixelCardProps): JSX.Element {
    const {
        containerRef,
        onBlur,
        onFocus,
        onMouseEnter,
        onMouseLeave,
        finalNoFocus,
        canvasRef,
        renderBorders,
    } = usePixelCard({
        variant,
        gap,
        colors,
        speed,
        noFocus,
        focusOnMount,
        borders,
    });

    return (
        <Box
            ref={containerRef}
            className={styles.pixel_card}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={finalNoFocus ? undefined : onFocus}
            onBlur={finalNoFocus ? undefined : onBlur}
            tabIndex={finalNoFocus ? -1 : 0}
            sx={{
                width,
                height,
                borderRadius: roundedBorders ? "25px" : 0,
                ...renderBorders(),
            }}
        >
            <canvas className={styles.pixel_canvas} ref={canvasRef} />
            <Box className={styles.pixel_content}>{children}</Box>
        </Box>
    );
}
