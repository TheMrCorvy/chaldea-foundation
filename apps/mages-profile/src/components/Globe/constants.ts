export const markedCountries = ["Argentina", "Australia"];

export const initialRotationState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
};

// Canvas and viewport sizes
export const width = 500;
export const height = 500;

// Animation configuration
export const ANIMATION_DURATION = 1500; // 1.5 seconds in milliseconds
export const BASE_SCALE = 250;
export const ZOOM_FACTOR = 1.2; // Multiplier for zoomed in state (prevents over-zooming)

// Zoom level constraints
export const MIN_SCALE = 15;
export const MAX_SCALE_MULTIPLIER = 1.2;

// Sensitivity and rotation
export const sensitivity = 75;
export const rotationSpeed = 1;

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

// Coordinate types and initial values
export type Coordinates = [number, number];

export const scale = 250;
export const center: Coordinates = [0, 0];
export const rotate: Coordinates = [0, -30];
export const translate: Coordinates = [width / 2, height / 2];
