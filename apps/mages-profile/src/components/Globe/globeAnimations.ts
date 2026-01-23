import * as d3 from "d3";
import { BASE_SCALE, ZOOM_FACTOR } from "./constants";
import { GeoFeature } from "./useChaldeas";
import {
    findCountryCenter,
    calculateRotationToCenter,
    animateFrame,
} from "./animationHelpers";

export interface GlobeAnimationState {
    isZoomedIn: boolean;
    selectedCountry: string | null;
    targetScale: number;
    currentScale: number;
    isAnimating: boolean;
}

export interface AnimateToCountryParams {
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
    pathGeneratorRef: React.MutableRefObject<d3.GeoPath<
        unknown,
        GeoJSON.Feature
    > | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    animationTimerRef: React.MutableRefObject<number | null>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    worldData: GeoJSON.FeatureCollection;
}

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
    const countryCenter = findCountryCenter(
        worldData.features as GeoFeature[],
        countryName
    );

    if (!feature || !countryCenter) return;

    rotationControlsRef.current?.stopAutoRotation();
    if (animationTimerRef.current)
        cancelAnimationFrame(animationTimerRef.current);

    const projection = projectionRef.current;
    const initialRotate = projection.rotate() as unknown as [number, number];
    const targetRotate = calculateRotationToCenter(countryCenter);
    const initialScale = projection.scale();
    const targetScale = targetZoomedState
        ? ZOOM_FACTOR * BASE_SCALE
        : BASE_SCALE;

    animationState.isAnimating = true;
    const startTime = performance.now();

    const animate = (timestamp: number): void => {
        const isComplete = animateFrame(
            {
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
            },
            timestamp
        );

        if (!isComplete) {
            animationTimerRef.current = requestAnimationFrame(animate);
        } else {
            animationTimerRef.current = null;
        }
    };

    animationTimerRef.current = requestAnimationFrame(animate);
};
