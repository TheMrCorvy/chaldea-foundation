import * as d3 from "d3";
import { ANIMATION_DURATION, MAX_ZOOM_SCALE, width } from "./constants";

export interface AnimateFrameParams {
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
    circle: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>;
    initialRotate: [number, number];
    targetRotate: [number, number];
    initialScale: number;
    targetScale: number;
    startTime: number;
    onComplete: () => void;
}

export const findCountryCenter = (
    features: GeoJSON.Feature[],
    countryName: string
): [number, number] | null => {
    const feature = features.find(
        (f) => (f.properties as Record<string, unknown>).name === countryName
    );
    if (!feature?.geometry) return null;
    const bounds = d3.geoBounds(feature);
    return [
        (bounds[0][0] + bounds[1][0]) / 2,
        (bounds[0][1] + bounds[1][1]) / 2,
    ] as [number, number];
};

export const calculateRotationToCenter = (
    center: [number, number]
): [number, number] => [-center[0], -center[1]];

export const calculateZoomScale = (
    feature: GeoJSON.Feature,
    baseScale: number
): number => {
    const bounds = d3.geoBounds(feature);
    const maxDim = Math.max(
        bounds[1][0] - bounds[0][0],
        bounds[1][1] - bounds[0][1]
    );
    const zoomFactor = Math.max(1.2, Math.min(200 / maxDim, 1.5));
    return Math.min(baseScale * zoomFactor, MAX_ZOOM_SCALE);
};

const interpolateValue = (
    start: number,
    end: number,
    progress: number
): number => start + (end - start) * progress;

export const animateFrame = (
    params: AnimateFrameParams,
    timestamp: number
): boolean => {
    const progress = Math.min(
        (timestamp - params.startTime) / ANIMATION_DURATION,
        1
    );
    const interpolate = d3.interpolate(
        params.initialRotate,
        params.targetRotate
    );
    const currentRotate = interpolate(progress) as [number, number];
    const currentScale = interpolateValue(
        params.initialScale,
        params.targetScale,
        progress
    );

    params.projection.rotate(currentRotate).scale(currentScale);
    params.svg
        .selectAll<SVGPathElement, GeoJSON.Feature>("path")
        .attr("d", (d: GeoJSON.Feature) => params.pathGenerator(d) as string);
    params.circle.attr("r", currentScale);
    params.projection.translate([width / 2, width / 2]);

    // Resize SVG to accommodate scaled globe
    const scaleFactor = currentScale / params.initialScale;
    const newSize = Math.max(width * scaleFactor, width);
    params.svg.attr("width", newSize).attr("height", newSize);

    if (progress === 1) {
        params.onComplete();
        return true;
    }
    return false;
};
