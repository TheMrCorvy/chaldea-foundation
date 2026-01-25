import { Coordinates } from "./types";

export const markedCountries = ["Argentina", "Australia"];

export const initialRotationState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
};

// Animation configuration
export const ANIMATION_DURATION = 1000;
export const BASE_SCALE = 250;
export const MOBILE_BASE_SCALE = 150;
export const ZOOM_FACTOR = 1.2; // Multiplier for zoomed in state (prevents over-zooming)

// Sensitivity and rotation
export const sensitivity = 75;

// Colors and styling
export const backgrounds = [
    "#E63946",
    "#FFFFFF",
    "#F1FAEE",
    "#A8DADC",
    "#457B9D",
    "#1D3557",
];

export const strokeWidth = 0.3;
export const thinnerStrokeWidth = "0.2";
export const strokeColor = "black";
export const opacity = 0.8;

export const center: Coordinates = [0, 0];
export const rotate: Coordinates = [0, -30];
