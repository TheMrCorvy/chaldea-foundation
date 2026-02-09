import { JSX } from "react";
import usePixelCard, { UsePixelCardProps } from "./usePixelCard";
import styles from "./PixelCard.module.css";

export interface PixelCardProps extends UsePixelCardProps {
    children: React.ReactNode;
}

export default function PixelCard({
    variant = "default",
    gap,
    speed,
    colors,
    noFocus,
    children,
    focusOnMount = false,
}: PixelCardProps): JSX.Element {
    const {
        containerRef,
        onBlur,
        onFocus,
        onMouseEnter,
        onMouseLeave,
        finalNoFocus,
        canvasRef,
    } = usePixelCard({ variant, gap, colors, speed, noFocus, focusOnMount });

    return (
        <div
            ref={containerRef}
            className={styles.pixel_card}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={finalNoFocus ? undefined : onFocus}
            onBlur={finalNoFocus ? undefined : onBlur}
            tabIndex={finalNoFocus ? -1 : 0}
        >
            <canvas className={styles.pixel_canvas} ref={canvasRef} />
            <div>{children}</div>
        </div>
    );
}
