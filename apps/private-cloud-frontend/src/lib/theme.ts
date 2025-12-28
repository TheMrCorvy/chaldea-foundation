import { CssVarsThemeOptions, extendTheme } from "@mui/joy/styles";

export const themeConfig: CssVarsThemeOptions = {
    cssVarPrefix: "joy",
    colorSchemes: {
        dark: {
            palette: {
                background: {
                    body: "#0A1220", // deep navy
                    surface: "#111A2B",
                    popup: "#0F1726",
                    level1: "#0E1626",
                    level2: "#141E31",
                },
                text: {
                    primary: "#E5EAF2",
                    secondary: "#A8B2C3",
                    tertiary: "#7C879C",
                },
                // --- MAIN BRAND COLOR (Orange)
                primary: {
                    50: "#FFE8D9",
                    100: "#FFD0B5",
                    200: "#FFB088",
                    300: "#FF9466",
                    400: "#FF7A45",
                    500: "#FF5A1F",
                    600: "#E24917",
                    700: "#C03A12",
                    800: "#9A2E0E",
                    900: "#7C240B",
                    solidBg: "#FF5A1F",
                    solidHoverBg: "#E24917",
                    solidActiveBg: "#C03A12",
                },
                // --- Functional Colors
                danger: {
                    // warm red — looks amazing against navy
                    50: "#FFD9DD",
                    100: "#FFAEB6",
                    200: "#FF8792",
                    300: "#FF6070",
                    400: "#FF3F54",
                    500: "#FF1F3D", // main
                    600: "#E01635",
                    700: "#B5122D",
                    800: "#8A0E22",
                    900: "#640A1A",
                    solidBg: "#FF1F3D",
                },
                warning: {
                    // deep amber/gold (works well with navy)
                    50: "#FFECC7",
                    100: "#FFDA8A",
                    200: "#FFC75A",
                    300: "#FFB42E",
                    400: "#FFA30E",
                    500: "#FF9200", // main
                    600: "#E27F00",
                    700: "#C06A00",
                    800: "#9A5500",
                    900: "#7A4300",
                    solidBg: "#FF9200",
                },
                success: {
                    // teal-green (cool tone complements orange)
                    50: "#D5F6EE",
                    100: "#A6EAD7",
                    200: "#78DEC0",
                    300: "#4DD3AB",
                    400: "#2AC998",
                    500: "#10C087", // main
                    600: "#0FAF7A",
                    700: "#0E986A",
                    800: "#0C7C57",
                    900: "#0A6346",
                    solidBg: "#10C087",
                },
                neutral: {
                    // light blue tones with better contrast
                    50: "#2A3B52",
                    100: "#3A4D68",
                    200: "#4A607E",
                    300: "#5A7394",
                    400: "#6A86AA",
                    500: "#7A99C0",
                    600: "#8AACD6",
                    700: "#9ABFEC",
                    800: "#B0CFFF",
                    900: "#C6DFFF",
                },
            },
        },
    },

    // --- REMOVE ALL SHADOWS ---
    shadow: {
        xs: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
    },

    components: {
        JoySheet: { styleOverrides: { root: { boxShadow: "none" } } },
        JoyCard: { styleOverrides: { root: { boxShadow: "none" } } },
        JoyModalDialog: { styleOverrides: { root: { boxShadow: "none" } } },
        JoyMenu: { styleOverrides: { root: { boxShadow: "none" } } },
        JoyButton: {
            defaultProps: { color: "primary", variant: "solid" },
            styleOverrides: { root: { boxShadow: "none" } },
        },
    },
};

export const theme = extendTheme(themeConfig);
