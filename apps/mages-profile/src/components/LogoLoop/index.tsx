import {
    CSSProperties,
    FC,
    ReactElement,
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    ANIMATION_CONFIG,
    GLITCH_KEYFRAMES,
    HOLOGRAM_COLORS,
} from "./constants";
import { useResizeObserver } from "./useResizeObserver";
import useAnimationLoop from "./useAnimationLoop";

interface LogoLoopProps {
    items: ReactElement[];
    isVertical?: boolean;
    duration?: number;
    direction?: "normal" | "reverse";
    gap?: string;
    isMobile?: boolean;
}

const LogoLoop: FC<LogoLoopProps> = ({
    items,
    isVertical = false,
    duration = 20,
    direction = "normal",
    gap = "1rem",
    isMobile = false,
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
            maxWidth: isVertical ? "100%" : isMobile ? "70dvw" : undefined,
            overflow: "hidden",
            position: "relative",
            isolation: "isolate",
            borderRadius: "8px",
        }),
        [isVertical, isMobile]
    );

    const trackStyle: CSSProperties = useMemo(
        () => ({
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            gap: 0,
            width: "max-content",
            minWidth: "100%",
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
            boxSizing: "border-box",
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
                            style={{
                                flex: isMobile ? "0 1 auto" : "0 0 auto",
                                maxWidth: isMobile ? "60dvw" : undefined,
                                minWidth: 0,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )),
        [copyCount, items, sequenceStyle, isMobile]
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
