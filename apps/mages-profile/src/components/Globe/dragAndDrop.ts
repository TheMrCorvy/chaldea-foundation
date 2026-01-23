import * as d3 from "d3";
import { sensitivity } from "./constants";
import { SetupDragListenersParams } from "./types";
import { updateGlobe } from "./rotation";

export const setupDragListeners = (
    params: SetupDragListenersParams
): (() => void) => {
    const {
        containerElement,
        svg,
        dragStateRef,
        projection,
        pathGenerator,
        timerRef,
        rotationControlsRef,
        isCountrySelected,
    } = params;

    containerElement.style.cursor = "grab";

    const handleMouseDown = (e: MouseEvent): void => {
        if (isCountrySelected) return;

        dragStateRef.current.isDragging = true;
        dragStateRef.current.startX = e.clientX;
        dragStateRef.current.startY = e.clientY;
        containerElement.style.cursor = "grabbing";
        rotationControlsRef.current?.stopAutoRotation();
    };

    const handleMouseMove = (e: MouseEvent): void => {
        if (!dragStateRef.current.isDragging || isCountrySelected) {
            return;
        }

        const dx = e.clientX - dragStateRef.current.startX;
        const dy = e.clientY - dragStateRef.current.startY;
        dragStateRef.current.startX = e.clientX;
        dragStateRef.current.startY = e.clientY;
        const k = sensitivity / projection.scale();
        const [rx, ry] = projection.rotate();
        projection.rotate([rx + dx * k, ry - dy * k]);
        updateGlobe({ svg, pathGenerator });
    };

    const handleMouseUp = (): void => {
        dragStateRef.current.isDragging = false;
        containerElement.style.cursor = "grab";

        if (!isCountrySelected) {
            rotationControlsRef.current?.resumeAutoRotation();
        }
    };

    svg.on("mousedown", handleMouseDown);
    containerElement.addEventListener("mousemove", handleMouseMove);
    containerElement.addEventListener("mouseup", handleMouseUp);

    return () => {
        svg.on("mousedown", null);
        containerElement.removeEventListener("mousemove", handleMouseMove);
        containerElement.removeEventListener("mouseup", handleMouseUp);
    };
};
