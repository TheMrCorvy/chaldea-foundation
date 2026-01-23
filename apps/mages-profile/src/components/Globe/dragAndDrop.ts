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
        rotationControlsRef,
        isCountrySelectedRef,
    } = params;

    const updateCursor = (): void => {
        if (isCountrySelectedRef.current) {
            containerElement.style.cursor = "default";
        } else if (dragStateRef.current.isDragging) {
            containerElement.style.cursor = "grabbing";
        } else {
            containerElement.style.cursor = "grab";
        }
    };

    const handleMouseDown = (e: MouseEvent): void => {
        if (isCountrySelectedRef.current) {
            return;
        }

        dragStateRef.current.isDragging = true;
        dragStateRef.current.startX = e.clientX;
        dragStateRef.current.startY = e.clientY;
        containerElement.style.cursor = "grabbing";
        rotationControlsRef.current?.stopAutoRotation();
    };

    const handleMouseMove = (e: MouseEvent): void => {
        if (!dragStateRef.current.isDragging || isCountrySelectedRef.current) {
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
        updateCursor();

        if (!isCountrySelectedRef.current) {
            rotationControlsRef.current?.resumeAutoRotation();
        }
    };

    const handleMouseOver = (): void => {
        updateCursor();
    };

    const handleMouseLeave = (): void => {
        containerElement.style.cursor = "default";
    };

    svg.on("mousedown", handleMouseDown);
    containerElement.addEventListener("mousemove", handleMouseMove);
    containerElement.addEventListener("mouseup", handleMouseUp);
    containerElement.addEventListener("mouseover", handleMouseOver);
    containerElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        svg.on("mousedown", null);
        containerElement.removeEventListener("mousemove", handleMouseMove);
        containerElement.removeEventListener("mouseup", handleMouseUp);
        containerElement.removeEventListener("mouseover", handleMouseOver);
        containerElement.removeEventListener("mouseleave", handleMouseLeave);
    };
};
