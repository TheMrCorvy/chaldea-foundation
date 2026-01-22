import * as d3 from "d3";
import { sensitivity } from "./constants";

interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
}

export interface DragAndDropHandlers {
    handleMouseDown: (e: MouseEvent) => void;
    handleMouseMove: (e: MouseEvent) => void;
    handleMouseUp: () => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
}

/**
 * Creates drag and drop handlers for the globe
 */
export const createDragAndDropHandlers = (
    containerElement: HTMLElement,
    dragStateRef: React.MutableRefObject<DragState>,
    projection: d3.GeoProjection,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    timerRef: React.MutableRefObject<d3.Timer | null>,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>,
    onRotationStart?: () => void,
    onRotationStop?: () => void
): DragAndDropHandlers => {
    const handleMouseDown = (e: MouseEvent): void => {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.startX = e.clientX;
        dragStateRef.current.startY = e.clientY;
        containerElement.style.cursor = "grabbing";

        if (onRotationStart) {
            onRotationStart();
        }
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

        if (onRotationStop) {
            onRotationStop();
        }
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseEnter,
        handleMouseLeave,
    };
};

/**
 * Attaches drag and drop event listeners to the container
 */
export const attachDragAndDropListeners = (
    containerElement: HTMLElement,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    handlers: DragAndDropHandlers
): (() => void) => {
    containerElement.style.cursor = "grab";
    svg.on("mousedown", handlers.handleMouseDown);

    containerElement.addEventListener("mouseenter", handlers.handleMouseEnter);
    containerElement.addEventListener("mouseleave", handlers.handleMouseLeave);
    containerElement.addEventListener("mousemove", handlers.handleMouseMove);
    containerElement.addEventListener("mouseup", handlers.handleMouseUp);
    containerElement.addEventListener("mouseleave", handlers.handleMouseUp);

    // Return cleanup function
    return () => {
        containerElement.removeEventListener(
            "mouseenter",
            handlers.handleMouseEnter
        );
        containerElement.removeEventListener(
            "mouseleave",
            handlers.handleMouseLeave
        );
        containerElement.removeEventListener(
            "mousemove",
            handlers.handleMouseMove
        );
        containerElement.removeEventListener("mouseup", handlers.handleMouseUp);
        containerElement.removeEventListener(
            "mouseleave",
            handlers.handleMouseUp
        );
        svg.on("mousedown", null);
    };
};
