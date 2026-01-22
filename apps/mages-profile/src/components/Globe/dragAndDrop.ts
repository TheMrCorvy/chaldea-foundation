import * as d3 from "d3";
import { sensitivity } from "./constants";

interface GeoFeature extends GeoJSON.Feature {
    properties: { name: string };
}

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
}

const updateGlobe = (
    projection: d3.GeoProjection,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>
): void => {
    svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
        "d",
        (d: GeoFeature) => pathGenerator(d) as string
    );
};

export const setupDragListeners = (
    containerElement: HTMLElement,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    dragStateRef: React.MutableRefObject<DragState>,
    projection: d3.GeoProjection,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>,
    timerRef: React.MutableRefObject<d3.Timer | null>,
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>
): (() => void) => {
    containerElement.style.cursor = "grab";

    const handleMouseDown = (e: MouseEvent): void => {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.startX = e.clientX;
        dragStateRef.current.startY = e.clientY;
        containerElement.style.cursor = "grabbing";
        rotationControlsRef.current?.stopAutoRotation();
    };

    const handleMouseMove = (e: MouseEvent): void => {
        if (!dragStateRef.current.isDragging) return;
        const dx = e.clientX - dragStateRef.current.startX;
        const dy = e.clientY - dragStateRef.current.startY;
        dragStateRef.current.startX = e.clientX;
        dragStateRef.current.startY = e.clientY;
        const k = sensitivity / projection.scale();
        const [rx, ry] = projection.rotate();
        projection.rotate([rx + dx * k, ry - dy * k]);
        updateGlobe(projection, svg, pathGenerator);
    };

    const handleMouseUp = (): void => {
        dragStateRef.current.isDragging = false;
        containerElement.style.cursor = "grab";
        rotationControlsRef.current?.resumeAutoRotation();
    };

    const handleMouseLeave = (): void => {
        if (dragStateRef.current.isDragging) {
            handleMouseUp();
        }
        if (timerRef.current) timerRef.current.stop();
        timerRef.current = d3.timer(() => {
            const [rx] = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([rx - k, projection.rotate()[1]]);
            updateGlobe(projection, svg, pathGenerator);
        }, 200);
    };

    svg.on("mousedown", handleMouseDown);
    containerElement.addEventListener("mousemove", handleMouseMove);
    containerElement.addEventListener("mouseup", handleMouseUp);
    containerElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        svg.on("mousedown", null);
        containerElement.removeEventListener("mousemove", handleMouseMove);
        containerElement.removeEventListener("mouseup", handleMouseUp);
        containerElement.removeEventListener("mouseleave", handleMouseLeave);
    };
};
