import { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldDataImport from "../../lib/world.json";

const worldData = worldDataImport as GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJSON.GeoJsonProperties
>;
import { initialRotationState, BASE_SCALE } from "./constants";
import { GlobeAnimationState } from "./globeAnimations";
import { setupGlobeProjection } from "./globeProjection";
import {
    createDragAndDropHandlers,
    attachDragAndDropListeners,
    DragState,
} from "./dragAndDrop";
import { createRotationControls } from "./rotation";
import { handleCountryClick } from "./events";

export interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

export interface UseChaldeasResult {
    mapContainer: React.RefObject<HTMLDivElement | null>;
    onCountryClick: (countryName: string) => void;
}

export const useChaldeas = (
    onCountrySelect?: (country: string) => void
): UseChaldeasResult => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const timerRef = useRef<d3.Timer | null>(null);
    const dragStateRef = useRef<DragState>(initialRotationState);
    const animationStateRef = useRef<GlobeAnimationState>({
        isZoomedIn: false,
        selectedCountry: null,
        targetScale: BASE_SCALE,
        currentScale: BASE_SCALE,
        isAnimating: false,
    });
    const projectionRef = useRef<d3.GeoProjection | null>(null);
    const svgRef = useRef<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>(null);
    const animationTimerRef = useRef<number | null>(null);
    const circleRef = useRef<d3.Selection<
        SVGCircleElement,
        unknown,
        HTMLElement,
        unknown
    > | null>(null);
    const pathGeneratorRef = useRef<d3.GeoPath<
        unknown,
        GeoJSON.Feature
    > | null>(null);
    const rotationControlsRef = useRef<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const containerElement = mapContainer.current;

        // Setup globe projection with all elements
        const { projection, svg, circle, pathGenerator } =
            setupGlobeProjection(containerElement);

        projectionRef.current = projection;
        svgRef.current = svg;
        circleRef.current = circle;
        pathGeneratorRef.current = pathGenerator;

        // Create rotation controls
        rotationControlsRef.current = createRotationControls(
            timerRef,
            projection,
            svg,
            pathGenerator
        );

        // Create drag and drop handlers
        const dragHandlers = createDragAndDropHandlers(
            containerElement,
            dragStateRef,
            projection,
            svg,
            timerRef,
            pathGenerator,
            rotationControlsRef.current.stopAutoRotation,
            () => {
                // Optionally handle rotation stop
            }
        );

        // Attach drag and drop listeners
        const detachDragListeners = attachDragAndDropListeners(
            containerElement,
            svg,
            dragHandlers
        );

        // Start automatic rotation
        rotationControlsRef.current.resumeAutoRotation();

        const timer = timerRef.current;
        const animTimer = animationTimerRef.current;

        return () => {
            if (timer !== null) {
                timer.stop();
            }

            if (animTimer !== null) {
                cancelAnimationFrame(animTimer);
            }

            detachDragListeners();
            d3.selectAll("svg").remove();
        };
    }, []);

    return {
        mapContainer,
        onCountryClick: (countryName: string) =>
            handleCountryClick({
                countryName,
                projectionRef,
                svgRef,
                circleRef,
                animationStateRef,
                rotationControlsRef,
                onCountrySelect,
                worldData,
                animationTimerRef,
            }),
    };
};
