import {
    CSSProperties,
    FC,
    ReactElement,
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface LogoLoopProps {
    items: ReactElement[];
    isVertical?: boolean;
    duration?: number;
    direction?: "normal" | "reverse";
    gap?: string;
}

const ANIMATION_CONFIG = {
    SMOOTH_TAU: 0.25,
    MIN_COPIES: 2,
    COPY_HEADROOM: 2,
} as const;

const HOLOGRAM_COLORS = {
    edgeGlowStrong: "rgba(8, 46, 105, 0.45)",
    edgeGlowInner: "rgba(42, 131, 156, 0.3)",
    edgeGradientStrong: "rgba(129, 241, 255, 0.28)",
    edgeGradientSoft: "rgba(129, 241, 255, 0.12)",
    glitchStripe: "rgba(79, 235, 255, 0.18)",
    noiseCyan: "rgba(70, 233, 255, 0.14)",
    noiseWhite: "rgba(255, 255, 255, 0.03)",
    transparent: "rgba(0, 0, 0, 0)",
} as const;

const GLITCH_KEYFRAMES = `
@keyframes logo-loop-holo-shift {
    0%, 100% {
        opacity: 0.32;
        transform: translate3d(0, 0, 0);
    }
    17% {
        opacity: 0.45;
        transform: translate3d(-1px, 0, 0);
    }
    18% {
        opacity: 0.25;
        transform: translate3d(1px, 0, 0);
    }
    39% {
        opacity: 0.4;
        transform: translate3d(0, 0, 0);
    }
    40% {
        opacity: 0.52;
        transform: translate3d(0, -1px, 0);
    }
    41% {
        opacity: 0.28;
        transform: translate3d(0, 1px, 0);
    }
    75% {
        opacity: 0.38;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes logo-loop-holo-flicker {
    0%, 100% {
        opacity: 0.18;
    }
    5% {
        opacity: 0.24;
    }
    6% {
        opacity: 0.14;
    }
    31% {
        opacity: 0.2;
    }
    32% {
        opacity: 0.3;
    }
    33% {
        opacity: 0.16;
    }
    64% {
        opacity: 0.26;
    }
    65% {
        opacity: 0.17;
    }
}

@media (prefers-reduced-motion: reduce) {
    .logo-loop-glitch,
    .logo-loop-noise {
        animation: none !important;
    }
}
`;

const useResizeObserver = (
    callback: () => void,
    elements: Array<RefObject<Element | null>>
) => {
    useEffect(() => {
        if (!window.ResizeObserver) {
            const handleResize = () => callback();
            window.addEventListener("resize", handleResize);
            callback();
            return () => window.removeEventListener("resize", handleResize);
        }

        const observers = elements.map((ref) => {
            if (!ref.current) return null;
            const observer = new ResizeObserver(callback);
            observer.observe(ref.current);
            return observer;
        });

        callback();

        return () => {
            observers.forEach((observer) => observer?.disconnect());
        };
    }, [callback, elements]);
};

const useImageLoader = (
    seqRef: RefObject<HTMLDivElement | null>,
    onLoad: () => void
) => {
    useEffect(() => {
        const images = seqRef.current?.querySelectorAll("img") ?? [];

        if (images.length === 0) {
            onLoad();
            return;
        }

        let remainingImages = images.length;
        const handleImageLoad = () => {
            remainingImages -= 1;
            if (remainingImages === 0) {
                onLoad();
            }
        };

        images.forEach((img) => {
            const htmlImg = img as HTMLImageElement;
            if (htmlImg.complete) {
                handleImageLoad();
            } else {
                htmlImg.addEventListener("load", handleImageLoad, {
                    once: true,
                });
                htmlImg.addEventListener("error", handleImageLoad, {
                    once: true,
                });
            }
        });

        return () => {
            images.forEach((img) => {
                img.removeEventListener("load", handleImageLoad);
                img.removeEventListener("error", handleImageLoad);
            });
        };
    }, [seqRef, onLoad]);
};

const useAnimationLoop = (
    trackRef: RefObject<HTMLDivElement | null>,
    targetVelocity: number,
    sequenceSize: number,
    isVertical: boolean
) => {
    const rafRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        if (sequenceSize > 0) {
            offsetRef.current =
                ((offsetRef.current % sequenceSize) + sequenceSize) %
                sequenceSize;
            const transformValue = isVertical
                ? `translate3d(0, ${-offsetRef.current}px, 0)`
                : `translate3d(${-offsetRef.current}px, 0, 0)`;
            track.style.transform = transformValue;
        }

        const animate = (timestamp: number) => {
            if (lastTimestampRef.current === null) {
                lastTimestampRef.current = timestamp;
            }

            const deltaTime =
                Math.max(0, timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            const easingFactor =
                1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
            velocityRef.current +=
                (targetVelocity - velocityRef.current) * easingFactor;

            if (sequenceSize > 0) {
                let nextOffset =
                    offsetRef.current + velocityRef.current * deltaTime;
                nextOffset =
                    ((nextOffset % sequenceSize) + sequenceSize) % sequenceSize;
                offsetRef.current = nextOffset;

                const transformValue = isVertical
                    ? `translate3d(0, ${-offsetRef.current}px, 0)`
                    : `translate3d(${-offsetRef.current}px, 0, 0)`;
                track.style.transform = transformValue;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastTimestampRef.current = null;
        };
    }, [targetVelocity, sequenceSize, isVertical, trackRef]);
};

const LogoLoop: FC<LogoLoopProps> = ({
    items,
    isVertical = false,
    duration = 20,
    direction = "normal",
    gap = "1rem",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const sequenceRef = useRef<HTMLDivElement>(null);
    const isReverse = direction === "reverse";
    const [sequenceSize, setSequenceSize] = useState(0);
    const [copyCount, setCopyCount] = useState<number>(
        ANIMATION_CONFIG.MIN_COPIES
    );

    const containerStyle: CSSProperties = useMemo(
        () => ({
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            width: isVertical ? "auto" : "100%",
            height: isVertical ? "100%" : "auto",
            overflow: "hidden",
            position: "relative",
            isolation: "isolate",
            borderRadius: "8px",
        }),
        [isVertical]
    );

    const trackStyle: CSSProperties = useMemo(
        () => ({
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap: 0,
            width: "max-content",
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            paddingTop: "5px",
            paddingBottom: "5px",
            borderRadius: "8px",
        }),
        [isVertical]
    );

    const sequenceStyle: CSSProperties = useMemo(
        () => ({
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap,
            flexShrink: 0,
            width: "max-content",
            paddingRight: isVertical ? undefined : gap,
            paddingBottom: isVertical ? gap : undefined,
            boxSizing: "content-box",
        }),
        [isVertical, gap]
    );

    const edgeGlowStyle: CSSProperties = useMemo(
        () => ({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
            boxShadow: isVertical
                ? `inset 0 44px 36px -28px ${HOLOGRAM_COLORS.edgeGlowStrong}, inset 0 -44px 36px -28px ${HOLOGRAM_COLORS.edgeGlowStrong}, inset 0 0 28px ${HOLOGRAM_COLORS.edgeGlowInner}`
                : `inset 44px 0 36px -28px ${HOLOGRAM_COLORS.edgeGlowStrong}, inset -44px 0 36px -28px ${HOLOGRAM_COLORS.edgeGlowStrong}, inset 0 0 28px ${HOLOGRAM_COLORS.edgeGlowInner}`,
            background: isVertical
                ? `linear-gradient(180deg, ${HOLOGRAM_COLORS.edgeGradientStrong} 0%, ${HOLOGRAM_COLORS.edgeGradientSoft} 12%, ${HOLOGRAM_COLORS.transparent} 24%, ${HOLOGRAM_COLORS.transparent} 76%, ${HOLOGRAM_COLORS.edgeGradientSoft} 88%, ${HOLOGRAM_COLORS.edgeGradientStrong} 100%)`
                : `linear-gradient(90deg, ${HOLOGRAM_COLORS.edgeGradientStrong} 0%, ${HOLOGRAM_COLORS.edgeGradientSoft} 12%, ${HOLOGRAM_COLORS.transparent} 24%, ${HOLOGRAM_COLORS.transparent} 76%, ${HOLOGRAM_COLORS.edgeGradientSoft} 88%, ${HOLOGRAM_COLORS.edgeGradientStrong} 100%)`,
        }),
        [isVertical]
    );

    const glitchLayerStyle: CSSProperties = useMemo(
        () => ({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 3,
            mixBlendMode: "screen",
            opacity: 0.32,
            background: isVertical
                ? `repeating-linear-gradient(180deg, ${HOLOGRAM_COLORS.glitchStripe} 0 1px, ${HOLOGRAM_COLORS.transparent} 1px 4px)`
                : `repeating-linear-gradient(90deg, ${HOLOGRAM_COLORS.glitchStripe} 0 1px, ${HOLOGRAM_COLORS.transparent} 1px 4px)`,
            animation: "logo-loop-holo-shift 2200ms steps(2, end) infinite",
        }),
        [isVertical]
    );

    const noiseLayerStyle: CSSProperties = useMemo(
        () => ({
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 4,
            background: `linear-gradient(115deg, ${HOLOGRAM_COLORS.noiseCyan} 0%, ${HOLOGRAM_COLORS.noiseWhite} 48%, ${HOLOGRAM_COLORS.noiseCyan} 100%)`,
            opacity: 0.18,
            animation: "logo-loop-holo-flicker 1700ms linear infinite",
        }),
        []
    );

    const observedElements = useMemo(() => [containerRef, sequenceRef], []);

    const targetVelocity = useMemo(() => {
        if (duration <= 0) return 0;
        const directionFactor = isReverse ? -1 : 1;
        return (sequenceSize / duration) * directionFactor;
    }, [duration, isReverse, sequenceSize]);

    const updateDimensions = useCallback(() => {
        const container = containerRef.current;
        const sequence = sequenceRef.current;
        if (!container || !sequence) return;

        const sequenceRect = sequence.getBoundingClientRect();
        const size = isVertical ? sequenceRect.height : sequenceRect.width;
        const viewportSize = isVertical
            ? container.clientHeight ||
              container.parentElement?.clientHeight ||
              0
            : container.clientWidth;

        if (size <= 0) return;

        setSequenceSize(Math.ceil(size));
        const copiesNeeded =
            Math.ceil(viewportSize / size) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }, [isVertical]);

    useResizeObserver(updateDimensions, observedElements);

    useImageLoader(sequenceRef, updateDimensions);

    useAnimationLoop(trackRef, targetVelocity, sequenceSize, isVertical);

    const sequences = useMemo(
        () =>
            Array.from({ length: copyCount }, (_, copyIndex) => (
                <div
                    key={`sequence-copy-${copyIndex}`}
                    style={sequenceStyle}
                    ref={copyIndex === 0 ? sequenceRef : undefined}
                    aria-hidden={copyIndex > 0}
                >
                    {items.map((item, itemIndex) => (
                        <div
                            key={`copy-${copyIndex}-item-${itemIndex}`}
                            style={{ flex: "0 0 auto" }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )),
        [copyCount, items, sequenceStyle]
    );

    if (items.length === 0) {
        return null;
    }

    return (
        <div style={containerStyle} ref={containerRef}>
            <style>{GLITCH_KEYFRAMES}</style>
            <div ref={trackRef} style={trackStyle}>
                {sequences}
            </div>
            <div style={edgeGlowStyle} />
            <div className="logo-loop-glitch" style={glitchLayerStyle} />
            <div className="logo-loop-noise" style={noiseLayerStyle} />
        </div>
    );
};

export default LogoLoop;
