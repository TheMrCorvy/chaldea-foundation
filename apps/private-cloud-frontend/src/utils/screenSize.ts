const screenSizes = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

export const getScreenSize = (size: keyof typeof screenSizes): number => {
    return screenSizes[size];
};

export default screenSizes;
