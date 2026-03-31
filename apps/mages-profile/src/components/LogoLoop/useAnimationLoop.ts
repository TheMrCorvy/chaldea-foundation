import { RefObject, useEffect, useRef } from "react";
import { ANIMATION_CONFIG } from "./constants";

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

export default useAnimationLoop;
