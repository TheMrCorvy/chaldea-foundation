import { animateToCountry, GlobeAnimationState } from "./globeAnimations";
import * as d3 from "d3";

export interface HandleCountryClickProps {
    countryName: string;
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
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    animationTimerRef: React.MutableRefObject<number | null>;
    worldData: GeoJSON.FeatureCollection;
}

export const handleCountryClick = (props: HandleCountryClickProps): void => {
    const animationState = props.animationStateRef.current;
    if (animationState.isAnimating) return;

    const isClickingSameCountry =
        animationState.isZoomedIn &&
        animationState.selectedCountry === props.countryName;
    const shouldZoomOut = isClickingSameCountry;
    const targetZoomedState = shouldZoomOut ? false : true;

    animateToCountry({
        countryName: props.countryName,
        targetZoomedState,
        projectionRef: props.projectionRef,
        svgRef: props.svgRef,
        circleRef: props.circleRef,
        pathGeneratorRef: props.pathGeneratorRef,
        animationStateRef: props.animationStateRef,
        animationTimerRef: props.animationTimerRef,
        rotationControlsRef: props.rotationControlsRef,
        worldData: props.worldData,
    });
};
