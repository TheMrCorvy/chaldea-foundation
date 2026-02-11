import { useEffect, useRef } from "react";
import { Pixel } from "./Pixel";
import { getEffectiveSpeed, VARIANTS } from "./utils";

interface VariantConfig {
    activeColor: string | null;
    gap: number;
    speed: number;
    colors: string;
    noFocus: boolean;
}

export interface Borders {
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
}

export interface UsePixelCardProps {
    variant?: "default" | "blue" | "yellow" | "pink";
    gap?: number;
    speed?: number;
    colors?: string;
    noFocus?: boolean;
    focusOnMount?: boolean;
    borders?: boolean | Borders;
}

const initialBorders = {
    left: true,
    right: true,
};

const usePixelCard = ({
    variant = "default",
    gap,
    speed,
    colors,
    noFocus,
    focusOnMount = false,
    borders = initialBorders,
}: UsePixelCardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelsRef = useRef<Pixel[]>([]);
    const animationRef = useRef<ReturnType<
        typeof requestAnimationFrame
    > | null>(null);
    const timePreviousRef = useRef(performance.now());
    const reducedMotion = useRef(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ).current;

    const variantCfg: VariantConfig = VARIANTS[variant] || VARIANTS.default;
    const finalGap = gap ?? variantCfg.gap;
    const finalSpeed = speed ?? variantCfg.speed;
    const finalColors = colors ?? variantCfg.colors;
    const finalNoFocus = noFocus ?? variantCfg.noFocus;

    const initPixels = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        const ctx = canvasRef.current.getContext("2d");

        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        const colorsArray = finalColors.split(",");
        const pxs = [];
        for (let x = 0; x < width; x += parseInt(finalGap.toString(), 10)) {
            for (
                let y = 0;
                y < height;
                y += parseInt(finalGap.toString(), 10)
            ) {
                const color =
                    colorsArray[Math.floor(Math.random() * colorsArray.length)];

                const dx = x - width / 2;
                const dy = y - height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delay = reducedMotion ? 0 : distance;
                if (!ctx) return;
                pxs.push(
                    new Pixel(
                        canvasRef.current,
                        ctx,
                        x,
                        y,
                        color,
                        getEffectiveSpeed(finalSpeed, reducedMotion),
                        delay
                    )
                );
            }
        }
        pixelsRef.current = pxs;
    };

    const doAnimate = (fnName: keyof Pixel) => {
        animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
        const timeNow = performance.now();
        const timePassed = timeNow - timePreviousRef.current;
        const timeInterval = 1000 / 60;

        if (timePassed < timeInterval) return;
        timePreviousRef.current = timeNow - (timePassed % timeInterval);

        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || !canvasRef.current) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        let allIdle = true;
        for (let i = 0; i < pixelsRef.current.length; i++) {
            const pixel = pixelsRef.current[i];
            // @ts-expect-error Hide unnecessary error about fnName being a keyof Pixel
            pixel[fnName]();
            if (!pixel.isIdle) {
                allIdle = false;
            }
        }
        if (allIdle) {
            cancelAnimationFrame(animationRef.current);
        }
    };

    const handleAnimation = (name: keyof Pixel) => {
        if (animationRef.current !== null) {
            cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(() => doAnimate(name));
    };

    const onMouseEnter = () => handleAnimation("appear");
    const onMouseLeave = () => handleAnimation("disappear");
    const onFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        handleAnimation("appear");
    };
    const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.contains(e.relatedTarget)) return;
        handleAnimation("disappear");
    };

    const renderBorders = () => {
        const border = "1px solid rgba(25, 118, 210, 0.6)";

        if (typeof borders === "boolean") {
            return {
                border: borders ? border : "none",
            };
        }

        const result = {
            borderLeft: "none",
            borderRight: "none",
            borderTop: "none",
            borderBottom: "none",
        };

        if (borders.left) {
            result.borderLeft = border;
        }
        if (borders.right) {
            result.borderRight = border;
        }
        if (borders.top) {
            result.borderTop = border;
        }
        if (borders.bottom) {
            result.borderBottom = border;
        }

        return result;
    };

    useEffect(() => {
        initPixels();
        const observer = new ResizeObserver(() => {
            initPixels();
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => {
            observer.disconnect();
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalGap, finalSpeed, finalColors, finalNoFocus]);

    useEffect(() => {
        if (focusOnMount && containerRef.current) {
            handleAnimation("appear");
        }
    }, [focusOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        onMouseEnter,
        onMouseLeave,
        containerRef,
        finalNoFocus,
        onFocus,
        onBlur,
        canvasRef,
        renderBorders,
    };
};

export default usePixelCard;
