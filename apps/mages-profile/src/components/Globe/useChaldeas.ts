import { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldDataImport from "../../lib/world.json";
import { initialRotationState, BASE_SCALE } from "./constants";
import { GlobeAnimationState } from "./globeAnimations";
import { setupGlobeProjection } from "./globeProjection";
import { setupDragListeners } from "./dragAndDrop";
import { createRotationControls } from "./rotation";
import { handleCountryClick } from "./events";

const worldData = worldDataImport as GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJSON.GeoJsonProperties
>;

export interface GeoFeature extends GeoJSON.Feature {
    properties: { name: string };
}

export interface UseChaldeasResult {
    mapContainer: React.RefObject<HTMLDivElement | null>;
    onCountryClick: (countryName: string) => void;
}

export const useChaldeas = (): UseChaldeasResult => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const timerRef = useRef<d3.Timer | null>(null);
    const dragStateRef = useRef(initialRotationState);
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

        const { projection, svg, circle, pathGenerator } = setupGlobeProjection(
            mapContainer.current
        );

        projectionRef.current = projection;
        svgRef.current = svg;
        circleRef.current = circle;
        pathGeneratorRef.current = pathGenerator;

        rotationControlsRef.current = createRotationControls(
            timerRef,
            projection,
            svg,
            pathGenerator
        );

        const detachDragListeners = setupDragListeners(
            mapContainer.current,
            svg,
            dragStateRef as React.MutableRefObject<{
                isDragging: boolean;
                startX: number;
                startY: number;
                offsetX: number;
                offsetY: number;
            }>,
            projection,
            pathGenerator,
            timerRef,
            rotationControlsRef
        );

        rotationControlsRef.current.resumeAutoRotation();

        const timer = timerRef.current;
        const animTimer = animationTimerRef.current;

        return () => {
            if (timer) timer.stop();
            if (animTimer) cancelAnimationFrame(animTimer);
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
                pathGeneratorRef,
                animationStateRef,
                rotationControlsRef,
                worldData,
                animationTimerRef,
            }),
    };
};
