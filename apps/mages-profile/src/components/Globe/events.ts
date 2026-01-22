import {
    animateToCountry,
    GlobeAnimationState,
    rotateToCountryWhileZoomed,
} from "./globeAnimations";

export interface HandleCountryClickProps {
    countryName: string;
    projectionRef: React.MutableRefObject<d3.GeoProjection | null>;
    svgRef: React.MutableRefObject<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    onCountrySelect?: (country: string) => void;
    worldData: GeoJSON.FeatureCollection;
    animationTimerRef: React.MutableRefObject<number | null>;
    circleRef: React.MutableRefObject<d3.Selection<
        SVGCircleElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
}

export const handleCountryClick = (props: HandleCountryClickProps) => {
    const {
        countryName,
        projectionRef,
        svgRef,
        animationStateRef,
        rotationControlsRef,
        onCountrySelect,
        worldData,
        animationTimerRef,
        circleRef,
    } = props;

    const animationState = animationStateRef.current;

    if (animationState.isAnimating) return;

    if (
        animationState.isZoomedIn &&
        animationState.selectedCountry === countryName
    ) {
        // Zoom out and resume rotation
        animateToCountry({
            countryName,
            targetZoomedState: false,
            projectionRef,
            svgRef,
            animationStateRef,
            rotationControlsRef,
            worldData,
            animationTimerRef,
            circleRef,
        });
    } else if (animationState.isZoomedIn) {
        // Switch to different country while zoomed in
        // Just rotate without changing zoom
        rotateToCountryWhileZoomed({
            countryName,
            projectionRef,
            svgRef,
            animationStateRef,
            rotationControlsRef,
            worldData,
            onCountrySelect,
            animationTimerRef,
        });
    } else {
        // Zoom in to country
        animateToCountry({
            countryName,
            targetZoomedState: true,
            projectionRef,
            svgRef,
            animationStateRef,
            rotationControlsRef,
            worldData,
            animationTimerRef,
            circleRef,
        });
    }
};
