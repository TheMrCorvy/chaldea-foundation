import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import worldDataImport from "../../lib/world.json";
import { initialRotationState, BASE_SCALE } from "./constants";
import { animateToCountry } from "./globeAnimations";
import { setupGlobeProjection } from "./globeProjection";
import { setupDragListeners } from "./dragAndDrop";
import { createRotationControls } from "./rotation";
import {
    CircleRef,
    DragState,
    GlobeAnimationState,
    PathGeneratorRef,
    ProjectionRef,
    RotationControlsRef,
    SvgRef,
    TimeRef,
    UseChaldeasResult,
} from "./types";

const worldData = worldDataImport as GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJSON.GeoJsonProperties
>;

export const useChaldeas = (): UseChaldeasResult => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const timerRef = useRef<TimeRef>(null);
    const dragStateRef = useRef<DragState>(initialRotationState as DragState);
    const animationStateRef = useRef<GlobeAnimationState>({
        isZoomedIn: false,
        selectedCountry: null,
        targetScale: BASE_SCALE,
        currentScale: BASE_SCALE,
        isAnimating: false,
    });
    const projectionRef = useRef<ProjectionRef>(null);
    const svgRef = useRef<SvgRef>(null);
    const animationTimerRef = useRef<number | null>(null);
    const circleRef = useRef<CircleRef>(null);
    const pathGeneratorRef = useRef<PathGeneratorRef>(null);
    const rotationControlsRef = useRef<RotationControlsRef>(null);
    const [countrySelected, setCountrySelected] = useState<string | null>(null);
    const detachDragListenersRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const { projection, svg, circle, pathGenerator } = setupGlobeProjection(
            mapContainer.current
        );

        projectionRef.current = projection;
        svgRef.current = svg;
        circleRef.current = circle;
        pathGeneratorRef.current = pathGenerator;

        rotationControlsRef.current = createRotationControls({
            timerRef,
            projection,
            svg,
            pathGenerator,
        });

        detachDragListenersRef.current = setupDragListeners({
            containerElement: mapContainer.current,
            svg,
            dragStateRef,
            projection,
            pathGenerator,
            timerRef,
            rotationControlsRef,
            isCountrySelected: false,
        });

        rotationControlsRef.current.resumeAutoRotation();

        const timer = timerRef.current;
        const animTimer = animationTimerRef.current;

        return () => {
            if (timer) timer.stop();
            if (animTimer) cancelAnimationFrame(animTimer);
            detachDragListenersRef.current?.();
            d3.selectAll("svg").remove();
        };
    }, []);

    useEffect(() => {
        if (
            !mapContainer.current ||
            !projectionRef.current ||
            !svgRef.current ||
            !pathGeneratorRef.current
        ) {
            return;
        }

        // Detach old listeners
        detachDragListenersRef.current?.();

        // Reattach listeners with updated isCountrySelected state
        detachDragListenersRef.current = setupDragListeners({
            containerElement: mapContainer.current,
            svg: svgRef.current,
            dragStateRef,
            projection: projectionRef.current,
            pathGenerator: pathGeneratorRef.current,
            timerRef,
            rotationControlsRef,
            isCountrySelected: countrySelected !== null,
        });
    }, [countrySelected]);

    return {
        mapContainer,
        isCountrySelected: countrySelected !== null,
        onCountryClick: (countryName: string) => {
            setCountrySelected(countryName);

            animateToCountry({
                countryName,
                targetZoomedState:
                    animationStateRef.current.selectedCountry === countryName
                        ? !animationStateRef.current.isZoomedIn
                        : true,
                projectionRef,
                svgRef,
                circleRef,
                pathGeneratorRef,
                animationStateRef,
                animationTimerRef,
                rotationControlsRef,
                worldData,
            });
        },
    };
};
