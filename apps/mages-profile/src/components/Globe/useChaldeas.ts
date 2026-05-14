import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import worldDataImport from "../../lib/world.json";
import {
    initialRotationState,
    BASE_SCALE,
    MOBILE_BASE_SCALE,
} from "./constants";
import { animateToCountry, zoomOut } from "./globeAnimations";
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
    UseChaldeas,
} from "./types";
import { useSound } from "@/contexts/SoundContext";

const worldData = worldDataImport as GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJSON.GeoJsonProperties
>;

export const useChaldeas: UseChaldeas = ({ isMobile, markedCountries }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const timerRef = useRef<TimeRef>(null);
    const dragStateRef = useRef<DragState>(initialRotationState as DragState);
    const isCountrySelectedRef = useRef<boolean>(false);

    const scale = isMobile ? MOBILE_BASE_SCALE : BASE_SCALE;
    const animationStateRef = useRef<GlobeAnimationState>({
        isZoomedIn: false,
        selectedCountry: null,
        targetScale: scale,
        currentScale: scale,
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
    const [open, setOpen] = useState(false);

    const { playSound } = useSound();

    const handleCountryClick = useCallback(
        (countryName: string | null) => {
            setCountrySelected(countryName);
            playSound("modal");

            if (countryName === null) {
                setOpen(false);
                zoomOut({
                    projectionRef,
                    svgRef,
                    circleRef,
                    pathGeneratorRef,
                    animationStateRef,
                    animationTimerRef,
                    rotationControlsRef,
                    scale,
                });
            } else {
                setOpen(true);
                animateToCountry({
                    countryName,
                    targetZoomedState:
                        animationStateRef.current.selectedCountry ===
                        countryName
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
                    scale,
                });
            }
        },
        [scale, playSound]
    );

    useEffect(() => {
        if (!mapContainer.current) return;

        const { projection, svg, circle, pathGenerator } = setupGlobeProjection(
            {
                containerElement: mapContainer.current,
                onCountryClick: handleCountryClick,
                scale,
                markedCountries,
            }
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
            isMobile,
        });

        detachDragListenersRef.current = setupDragListeners({
            containerElement: mapContainer.current,
            svg,
            dragStateRef,
            projection,
            pathGenerator,
            rotationControlsRef,
            isCountrySelectedRef,
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
    }, [handleCountryClick, scale, isMobile]);

    // Update the ref whenever countrySelected changes
    useEffect(() => {
        isCountrySelectedRef.current = countrySelected !== null;
    }, [countrySelected]);

    return {
        mapContainer,
        countrySelected,
        onCountryClick: handleCountryClick,
        open,
    };
};
