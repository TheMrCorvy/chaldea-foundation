export const markedCountries = ["Argentina", "Australia"];

export const initialRotationState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
};

export const width = 500;
export const height = 500;
export const sensitivity = 75;

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
export const rotationSpeed = 1;

export type Coordinates = [number, number];

export const scale = 250;
export const center: Coordinates = [0, 0];
export const rotate: Coordinates = [0, -30];
export const translate: Coordinates = [width / 2, height / 2];
