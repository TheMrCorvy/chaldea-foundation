import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import worldData from "../../lib/world.json";
import {
    initialRotationState,
    width,
    sensitivity,
    height,
    backgrounds,
    strokeColor,
    strokeWidth,
    opacity,
    thinnerStrokeWidth,
    center,
    rotate,
    translate,
    markedCountries,
} from "./constants";
import {
    findCountryCenter,
    calculateRotationToCenter,
    calculateZoomScale,
    animateGlobe,
    GlobeAnimationState,
    AnimationConfig,
} from "./globeAnimations";

interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

const ANIMATION_DURATION = 1500; // 1.5 seconds in milliseconds
const BASE_SCALE = 250;

export interface UseChaldeasResult {
    mapContainer: React.RefObject<HTMLDivElement | null>;
    onCountryClick: (countryName: string) => void;
}

export const useChaldeas = (
    onCountrySelect?: (country: string) => void
): UseChaldeasResult => {
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

    const stopAutoRotation = useCallback(() => {
        if (timerRef.current !== null) {
            timerRef.current.stop();
            timerRef.current = null;
        }
    }, []);

    const resumeAutoRotation = useCallback(() => {
        if (timerRef.current !== null) {
            return;
        }

        if (!projectionRef.current || !svgRef.current) return;

        const projection = projectionRef.current;
        const svg = svgRef.current;

        timerRef.current = d3.timer(() => {
            const dRotate = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([dRotate[0] - 1 * k, dRotate[1]]);
            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => d3.geoPath().projection(projection)(d)
            );
        }, 200);
    }, []);

    const rotateToCountryWhileZoomed = useCallback(
        (countryName: string) => {
            if (!projectionRef.current || !svgRef.current) return;

            const animationState = animationStateRef.current;
            const projection = projectionRef.current;
            const svg = svgRef.current;

            stopAutoRotation();

            if (animationTimerRef.current !== null) {
                cancelAnimationFrame(animationTimerRef.current);
            }

            const countryCenter = findCountryCenter(
                worldData.features as GeoFeature[],
                countryName
            );
            if (!countryCenter) return;

            const initialRotate = projection.rotate() as unknown as [
                number,
                number,
            ];
            const targetRotate = calculateRotationToCenter(countryCenter);
            const initialScale = projection.scale();

            animationState.isAnimating = true;
            const startTime = performance.now();

            const animate = (timestamp: number) => {
                const config: AnimationConfig = {
                    duration: ANIMATION_DURATION,
                    startTime,
                    projection,
                    svg,
                    initialRotate,
                    targetRotate,
                    initialScale,
                    targetScale: initialScale,
                    onComplete: () => {
                        animationState.isAnimating = false;
                        animationState.selectedCountry = countryName;

                        if (onCountrySelect) {
                            onCountrySelect(countryName);
                        }
                    },
                };

                const isComplete = animateGlobe(config, timestamp);

                if (!isComplete) {
                    animationTimerRef.current = requestAnimationFrame(animate);
                } else {
                    animationTimerRef.current = null;
                }
            };

            animationTimerRef.current = requestAnimationFrame(animate);
        },
        [stopAutoRotation, onCountrySelect]
    );

    const animateToCountry = useCallback(
        (countryName: string, targetZoomedState: boolean) => {
            if (!projectionRef.current || !svgRef.current) return;

            const animationState = animationStateRef.current;
            const projection = projectionRef.current;
            const svg = svgRef.current;

            stopAutoRotation();

            if (animationTimerRef.current !== null) {
                cancelAnimationFrame(animationTimerRef.current);
            }

            const feature = (worldData.features as GeoFeature[]).find(
                (f) => f.properties.name === countryName
            );

            if (!feature) return;

            const countryCenter = findCountryCenter(
                worldData.features as GeoFeature[],
                countryName
            );
            if (!countryCenter) return;

            const initialRotate = projection.rotate() as unknown as [
                number,
                number,
            ];
            const targetRotate = calculateRotationToCenter(countryCenter);
            const initialScale = projection.scale();
            const targetScale = targetZoomedState
                ? calculateZoomScale(feature, BASE_SCALE)
                : BASE_SCALE;

            animationState.isAnimating = true;

            const startTime = performance.now();

            const animate = (timestamp: number) => {
                const config: AnimationConfig = {
                    duration: ANIMATION_DURATION,
                    startTime,
                    projection,
                    svg,
                    initialRotate,
                    targetRotate,
                    initialScale,
                    targetScale,
                    onComplete: () => {
                        animationState.isAnimating = false;
                        animationState.isZoomedIn = targetZoomedState;
                        animationState.selectedCountry = targetZoomedState
                            ? countryName
                            : null;
                        animationState.currentScale = targetScale;

                        if (targetZoomedState) {
                            stopAutoRotation();
                        } else {
                            resumeAutoRotation();
                        }

                        if (onCountrySelect) {
                            onCountrySelect(countryName);
                        }
                    },
                };

                const isComplete = animateGlobe(config, timestamp);

                if (!isComplete) {
                    animationTimerRef.current = requestAnimationFrame(animate);
                } else {
                    animationTimerRef.current = null;
                }
            };

            animationTimerRef.current = requestAnimationFrame(animate);
        },
        [stopAutoRotation, resumeAutoRotation, onCountrySelect]
    );

    const handleCountryClick = useCallback(
        (countryName: string) => {
            const animationState = animationStateRef.current;

            if (animationState.isAnimating) return;

            if (
                animationState.isZoomedIn &&
                animationState.selectedCountry === countryName
            ) {
                // Zoom out and resume rotation
                animateToCountry(countryName, false);
            } else if (animationState.isZoomedIn) {
                // Switch to different country while zoomed in
                // Just rotate without changing zoom
                rotateToCountryWhileZoomed(countryName);
            } else {
                // Zoom in to country
                animateToCountry(countryName, true);
            }
        },
        [animateToCountry, rotateToCountryWhileZoomed]
    );

    useEffect(() => {
        if (!mapContainer.current) return;

        const containerElement = mapContainer.current;

        const projection = d3
            .geoOrthographic()
            .scale(BASE_SCALE)
            .center(center)
            .rotate(rotate)
            .translate(translate);

        projectionRef.current = projection;

        const initialScale = projection.scale();
        const pathGenerator = d3.geoPath().projection(projection);

        const svg = d3
            .select(containerElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svgRef.current = svg as unknown as d3.Selection<
            SVGSVGElement,
            unknown,
            HTMLElement,
            unknown
        > | null;

        svg.append("circle")
            .attr("fill", "#EEE")
            .attr("stroke", strokeColor)
            .attr("stroke-width", thinnerStrokeWidth)
            .attr("cx", translate[0])
            .attr("cy", translate[1])
            .attr("r", initialScale);

        const map = svg.append("g");

        map.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(worldData.features as GeoFeature[])
            .enter()
            .append("path")
            .attr("d", (d: GeoFeature) => pathGenerator(d))
            .attr("fill", (d: GeoFeature) =>
                markedCountries.includes(d.properties.name)
                    ? backgrounds[0]
                    : backgrounds[1]
            )
            .style("stroke", strokeColor)
            .style("stroke-width", strokeWidth)
            .style("opacity", opacity);

        const handleMouseDown = (e: MouseEvent): void => {
            dragStateRef.current.isDragging = true;
            dragStateRef.current.startX = e.clientX;
            dragStateRef.current.startY = e.clientY;
            containerElement.style.cursor = "grabbing";
        };

        const handleMouseMove = (e: MouseEvent): void => {
            if (!dragStateRef.current.isDragging) return;

            const dx = e.clientX - dragStateRef.current.startX;
            const dy = e.clientY - dragStateRef.current.startY;

            dragStateRef.current.startX = e.clientX;
            dragStateRef.current.startY = e.clientY;

            const k = sensitivity / projection.scale();
            const bRotate = projection.rotate();
            projection.rotate([bRotate[0] + dx * k, bRotate[1] - dy * k]);

            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => pathGenerator(d)
            );
        };

        const handleMouseUp = (): void => {
            dragStateRef.current.isDragging = false;
            containerElement.style.cursor = "grab";
        };

        const handleMouseEnter = (): void => {
            if (timerRef.current !== null) {
                timerRef.current.stop();
                timerRef.current = null;
            }
        };

        const handleMouseLeave = (): void => {
            timerRef.current = d3.timer(() => {
                const rotate = projection.rotate();
                const k = sensitivity / projection.scale();
                projection.rotate([rotate[0] - 1 * k, rotate[1]]);
                svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                    "d",
                    (d: GeoFeature) => pathGenerator(d)
                );
            }, 200);
        };

        containerElement.style.cursor = "grab";
        svg.on("mousedown", handleMouseDown);

        containerElement?.addEventListener("mouseenter", handleMouseEnter);
        containerElement?.addEventListener("mouseleave", handleMouseLeave);

        containerElement.addEventListener("mousemove", handleMouseMove);
        containerElement.addEventListener("mouseup", handleMouseUp);
        containerElement.addEventListener("mouseleave", handleMouseUp);

        timerRef.current = d3.timer(() => {
            const dRotate = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([dRotate[0] - 1 * k, dRotate[1]]);
            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => pathGenerator(d)
            );
        }, 200);

        return () => {
            if (timerRef.current !== null) {
                timerRef.current.stop();
            }

            if (animationTimerRef.current !== null) {
                cancelAnimationFrame(animationTimerRef.current);
            }

            containerElement?.removeEventListener(
                "mouseenter",
                handleMouseEnter
            );
            containerElement?.removeEventListener(
                "mouseleave",
                handleMouseLeave
            );

            svg.on("mousedown", null);
            containerElement.removeEventListener("mousemove", handleMouseMove);
            containerElement.removeEventListener("mouseup", handleMouseUp);
            containerElement.removeEventListener("mouseleave", handleMouseUp);
            d3.selectAll("svg").remove();
        };
    }, []);

    return {
        mapContainer,
        onCountryClick: handleCountryClick,
    };
};
