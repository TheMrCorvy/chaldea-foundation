import * as d3 from "d3";

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
