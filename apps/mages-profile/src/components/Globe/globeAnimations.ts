import { BASE_SCALE, ZOOM_FACTOR } from "./constants";
import { GeoFeature } from "./useChaldeas";
import * as d3 from "d3";
import { ANIMATION_DURATION, width } from "./constants";
import {
    AnimateFrameParams,
    AnimateToCountryParams,
    Coordinates,
    FindCountryCenter,
} from "./types";

const findCountryCenter: FindCountryCenter = (params) => {
    const { features, countryName } = params;
    const feature = features.find(
        (f) => (f.properties as Record<string, unknown>).name === countryName
    );
    if (!feature?.geometry) return null;
    const bounds = d3.geoBounds(feature);
    return [
        (bounds[0][0] + bounds[1][0]) / 2,
        (bounds[0][1] + bounds[1][1]) / 2,
    ] as Coordinates;
};

const animateFrame = (params: AnimateFrameParams): boolean => {
    const {
        timestamp,
        startTime,
        initialRotate,
        targetRotate,
        initialScale,
        targetScale,
        projection,
        svg,
        pathGenerator,
        circle,
        onComplete,
    } = params;

    const progress = Math.min((timestamp - startTime) / ANIMATION_DURATION, 1);
    const interpolate = d3.interpolate(initialRotate, targetRotate);
    const currentRotate = interpolate(progress) as Coordinates;
    const currentScale = initialScale + (targetScale - initialScale) * progress;

    projection.rotate(currentRotate).scale(currentScale);
    svg.selectAll<SVGPathElement, GeoJSON.Feature>("path").attr(
        "d",
        (d: GeoJSON.Feature) => pathGenerator(d) as string
    );
    circle.attr("r", currentScale);

    // Resize SVG to accommodate scaled globe
    const scaleFactor = currentScale / initialScale;
    const newSize = Math.max(width * scaleFactor, width);

    svg.attr("width", newSize)
        .attr("height", newSize)
        .style("transform-origin", "center");

    if (progress === 1) {
        onComplete();
        return true;
    }
    return false;
};

export const animateToCountry = (params: AnimateToCountryParams): void => {
    const {
        projectionRef,
        svgRef,
        circleRef,
        pathGeneratorRef,
        animationStateRef,
        animationTimerRef,
        rotationControlsRef,
        worldData,
        countryName,
        targetZoomedState,
    } = params;

    if (
        !projectionRef.current ||
        !svgRef.current ||
        !circleRef.current ||
        !pathGeneratorRef.current
    )
        return;

    const animationState = animationStateRef.current;
    if (animationState.isAnimating) return;

    const feature = (worldData.features as GeoFeature[]).find(
        (f) => f.properties.name === countryName
    );
    const countryCenter = findCountryCenter({
        features: worldData.features,
        countryName,
    });

    if (!feature || !countryCenter) return;

    rotationControlsRef.current?.stopAutoRotation();

    if (animationTimerRef.current)
        cancelAnimationFrame(animationTimerRef.current);

    const projection = projectionRef.current;
    const initialRotate = projection.rotate() as unknown as [number, number];
    const targetRotate: Coordinates = [-countryCenter[0], -countryCenter[1]];
    const initialScale = projection.scale();
    const targetScale = targetZoomedState
        ? ZOOM_FACTOR * BASE_SCALE
        : BASE_SCALE;

    animationState.isAnimating = true;
    const startTime = performance.now();

    const animate = (timestamp: number): void => {
        const isComplete = animateFrame({
            projection,
            svg: svgRef.current!,
            pathGenerator: pathGeneratorRef.current!,
            circle: circleRef.current!,
            initialRotate,
            targetRotate,
            initialScale,
            targetScale,
            startTime,
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
            },
            timestamp,
        });

        if (!isComplete) {
            animationTimerRef.current = requestAnimationFrame(animate);
        } else {
            animationTimerRef.current = null;
        }
    };

    animationTimerRef.current = requestAnimationFrame(animate);
};
