import * as d3 from "d3";
import { ANIMATION_DURATION, BASE_SCALE, width } from "./constants";
import { GeoFeature } from "./useChaldeas";

export interface GlobeAnimationState {
    isZoomedIn: boolean;
    selectedCountry: string | null;
    targetScale: number;
    currentScale: number;
    isAnimating: boolean;
}

export interface AnimationConfig {
    duration: number; // in milliseconds
    startTime: number;
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    initialRotate: [number, number];
    targetRotate: [number, number];
    initialScale: number;
    targetScale: number;
    onComplete?: () => void;
    onScaleUpdate?: (currentScale: number) => void;
}

/**
 * Finds the center coordinates of a country feature
 */
export const findCountryCenter = (
    features: GeoJSON.Feature[],
    countryName: string
): [number, number] | null => {
    const feature = features.find(
        (f) => (f.properties as Record<string, unknown>).name === countryName
    );

    if (!feature || !feature.geometry) return null;

    const bounds = d3.geoBounds(feature);
    const center = [
        (bounds[0][0] + bounds[1][0]) / 2,
        (bounds[0][1] + bounds[1][1]) / 2,
    ] as [number, number];

    return center;
};

/**
 * Calculates rotation angles to center a point on the globe
 */
export const calculateRotationToCenter = (
    center: [number, number]
): [number, number] => {
    const rotation: [number, number] = [-center[0], -center[1]];
    return rotation;
};

/**
 * Interpolates between two rotation angles smoothly
 */
export const interpolateRotation = (
    start: [number, number],
    end: [number, number],
    progress: number
): [number, number] => {
    const interpolate = d3.interpolate(start, end);
    const result = interpolate(progress) as [number, number];
    return result;
};

/**
 * Interpolates between two scale values
 */
export const interpolateScale = (
    start: number,
    end: number,
    progress: number
): number => {
    return start + (end - start) * progress;
};

/**
 * Animates the globe to a target rotation and scale
 */
export const animateGlobe = (config: AnimationConfig, timestamp: number) => {
    const elapsed = timestamp - config.startTime;
    const progress = Math.min(elapsed / config.duration, 1);

    const currentRotate = interpolateRotation(
        config.initialRotate,
        config.targetRotate,
        progress
    );

    const currentScale = interpolateScale(
        config.initialScale,
        config.targetScale,
        progress
    );

    config.projection.rotate(currentRotate).scale(currentScale);

    config.svg
        .selectAll<SVGPathElement, GeoJSON.Feature>("path")
        .attr("d", (d: GeoJSON.Feature) =>
            d3.geoPath().projection(config.projection)(d)
        );

    // Notify about scale update for SVG resizing
    if (config.onScaleUpdate) {
        config.onScaleUpdate(currentScale);
    }

    if (progress === 1 && config.onComplete) {
        config.onComplete();
    }

    return progress === 1;
};

/**
 * Calculates the zoom scale for a country based on its bounds
 */
export const calculateZoomScale = (
    feature: GeoJSON.Feature,
    baseScale: number
): number => {
    const bounds = d3.geoBounds(feature);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const maxDim = Math.max(dx, dy);

    // Calculate appropriate zoom level based on country size
    const zoomFactor = 360 / maxDim / 1.2;
    return baseScale * zoomFactor;
};

export interface RotateToCountryWhileZoomedInProps {
    projectionRef: React.MutableRefObject<d3.GeoProjection | null>;
    countryName: string;
    svgRef: React.MutableRefObject<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    animationTimerRef: React.MutableRefObject<number | null>;
    worldData: GeoJSON.FeatureCollection;
    onCountrySelect?: (countryName: string) => void;
}

export const rotateToCountryWhileZoomed = (
    props: RotateToCountryWhileZoomedInProps
) => {
    const {
        projectionRef,
        countryName,
        svgRef,
        rotationControlsRef,
        animationStateRef,
        animationTimerRef,
        worldData,
        onCountrySelect,
    } = props;

    if (!projectionRef.current || !svgRef.current) return;
    if (!rotationControlsRef.current) return;

    const animationState = animationStateRef.current;
    const projection = projectionRef.current;
    const svg = svgRef.current;
    const { stopAutoRotation } = rotationControlsRef.current;

    stopAutoRotation();

    if (animationTimerRef.current !== null) {
        cancelAnimationFrame(animationTimerRef.current);
    }

    const countryCenter = findCountryCenter(
        worldData.features as GeoFeature[],
        countryName
    );
    if (!countryCenter) return;

    const initialRotate = projection.rotate() as unknown as [number, number];
    const targetRotate = calculateRotationToCenter(countryCenter);
    const initialScale = projection.scale();

    animationState.isAnimating = true;
    const startTime = performance.now();

    const animate = (timestamp: number) => {
        const config: AnimationConfig = {
            duration: ANIMATION_DURATION,
            startTime,
            projection,
            svg,
            initialRotate,
            targetRotate,
            initialScale,
            targetScale: initialScale,
            onComplete: () => {
                animationState.isAnimating = false;
                animationState.selectedCountry = countryName;

                if (onCountrySelect) {
                    onCountrySelect(countryName);
                }
            },
        };

        const isComplete = animateGlobe(config, timestamp);

        if (!isComplete) {
            animationTimerRef.current = requestAnimationFrame(animate);
        } else {
            animationTimerRef.current = null;
        }
    };

    animationTimerRef.current = requestAnimationFrame(animate);
};

export interface AnimateProps {
    countryName: string;
    targetZoomedState: boolean;
    projectionRef: React.MutableRefObject<d3.GeoProjection | null>;
    svgRef: React.MutableRefObject<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    circleRef: React.MutableRefObject<d3.Selection<
        SVGCircleElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    animationTimerRef: React.MutableRefObject<number | null>;
    worldData: GeoJSON.FeatureCollection;
    onCountrySelect?: (countryName: string) => void;
    startTime: number;
    initialRotate: [number, number];
    targetRotate: [number, number];
    initialScale: number;
    targetScale: number;
    timestamp: number;
}

export const animateGlobeZoom = (props: AnimateProps) => {
    const {
        countryName,
        targetZoomedState,
        projectionRef,
        svgRef,
        circleRef,
        rotationControlsRef,
        animationStateRef,
        animationTimerRef,
        onCountrySelect,
        startTime,
        initialRotate,
        targetRotate,
        initialScale,
        targetScale,
        timestamp,
    } = props;

    if (!projectionRef.current || !svgRef.current || !circleRef.current) return;
    if (!rotationControlsRef.current) return;

    const animationState = animationStateRef.current;
    const projection = projectionRef.current;
    const svg = svgRef.current;
    const config: AnimationConfig = {
        duration: ANIMATION_DURATION,
        startTime,
        projection,
        svg,
        initialRotate,
        targetRotate,
        initialScale,
        targetScale,
        onScaleUpdate: (currentScale: number) => {
            // Update SVG and circle size to match the scale
            if (svgRef.current && circleRef.current) {
                const scaleFactor = currentScale / initialScale;
                const newSize = Math.max(width * scaleFactor, width);

                svgRef.current.attr("width", newSize).attr("height", newSize);

                circleRef.current.attr("r", currentScale);
            }
        },
        onComplete: () => {
            animationState.isAnimating = false;
            animationState.isZoomedIn = targetZoomedState;
            animationState.selectedCountry = targetZoomedState
                ? countryName
                : null;
            animationState.currentScale = targetScale;

            if (rotationControlsRef.current) {
                if (targetZoomedState) {
                    rotationControlsRef.current.stopAutoRotation();
                } else {
                    rotationControlsRef.current.resumeAutoRotation();
                }
            }

            if (onCountrySelect) {
                onCountrySelect(countryName);
            }
        },
    };

    const isComplete = animateGlobe(config, timestamp);

    if (!isComplete) {
        animationTimerRef.current = requestAnimationFrame((newTimestamp) =>
            animateGlobeZoom({ ...props, timestamp: newTimestamp })
        );
    } else {
        animationTimerRef.current = null;
    }
};

export interface AnimateToCountryProps {
    countryName: string;
    targetZoomedState: boolean;
    projectionRef: React.MutableRefObject<d3.GeoProjection | null>;
    svgRef: React.MutableRefObject<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    circleRef: React.MutableRefObject<d3.Selection<
        SVGCircleElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    animationTimerRef: React.MutableRefObject<number | null>;
    worldData: GeoJSON.FeatureCollection;
}

export const animateToCountry = (props: AnimateToCountryProps) => {
    const {
        countryName,
        targetZoomedState,
        projectionRef,
        svgRef,
        circleRef,
        rotationControlsRef,
        animationStateRef,
        animationTimerRef,
        worldData,
    } = props;

    if (!projectionRef.current || !svgRef.current || !circleRef.current) return;
    if (!rotationControlsRef.current) return;

    const animationState = animationStateRef.current;
    const projection = projectionRef.current;
    const { stopAutoRotation } = rotationControlsRef.current;

    stopAutoRotation();

    if (animationTimerRef.current !== null) {
        cancelAnimationFrame(animationTimerRef.current);
    }

    const feature = (worldData.features as GeoFeature[]).find(
        (f) => f.properties.name === countryName
    );

    if (!feature) return;

    const countryCenter = findCountryCenter(
        worldData.features as GeoFeature[],
        countryName
    );
    if (!countryCenter) return;

    const initialRotate = projection.rotate() as unknown as [number, number];
    const targetRotate = calculateRotationToCenter(countryCenter);
    const initialScale = projection.scale();
    const targetScale = targetZoomedState
        ? calculateZoomScale(feature, BASE_SCALE)
        : BASE_SCALE;

    animationState.isAnimating = true;

    const startTime = performance.now();

    const animate = (timestamp: number) =>
        animateGlobeZoom({
            countryName,
            targetZoomedState,
            initialRotate,
            targetRotate,
            initialScale,
            targetScale,
            startTime,
            timestamp,
            projectionRef,
            svgRef,
            circleRef,
            rotationControlsRef,
            animationStateRef,
            animationTimerRef,
            worldData,
        });

    animationTimerRef.current = requestAnimationFrame(animate);
};
