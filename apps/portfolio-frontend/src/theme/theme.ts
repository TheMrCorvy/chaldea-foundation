"use client";
import { createTheme } from "@mui/material/styles";

// Light theme with pastel colors
const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#D7C4EB", // Pastel Lavender
            light: "#E9DDF5",
            dark: "#BFA6D6",
            contrastText: "#FFFFFF", // White text on primary color
        },
        secondary: {
            main: "#F3C9B8", // Pastel Peach Coral
            light: "#F9DED4",
            dark: "#DFA794",
            contrastText: "#FFFFFF", // White text on secondary color
        },
        error: {
            main: "#F5D2D2", // Soft Pastel Pink
            light: "#FBE7E7",
            dark: "#E8B3B3",
            contrastText: "#FFFFFF", // White text on error color
        },
        warning: {
            main: "#F8F7BA", // Buttery Pastel Yellow
            light: "#FDFCD6",
            dark: "#E0DE9B",
            contrastText: "#FFFFFF", // White text on warning color
        },
        success: {
            main: "#BDE3C3", // Pastel Mint Green
            light: "#D7F0DA",
            dark: "#9CC8A3",
            contrastText: "#FFFFFF", // White text on success color
        },
        info: {
            main: "#A3CCDA", // Pastel Sky Blue
            light: "#C7E2EC",
            dark: "#85B4C5",
            contrastText: "#FFFFFF", // White text on info color
        },
        background: {
            default: "#FFFFFF",
            paper: "#F9F9F9",
        },
        text: {
            primary: "#171717",
            secondary: "#666666",
        },
    },
    typography: {
        fontFamily: "var(--font-roboto)",
    },
    cssVariables: true,
});

// Dark theme with richer, more vibrant colors
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#9B7FC7", // Rich Purple (darker, more saturated lavender)
            light: "#B399D4",
            dark: "#7E5FAD",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#E89B7B", // Warm Coral (richer peach coral)
            light: "#EFAF96",
            dark: "#D17B58",
            contrastText: "#FFFFFF",
        },
        error: {
            main: "#E89898", // Soft Red (more saturated pink)
            light: "#F0B3B3",
            dark: "#D47777",
            contrastText: "#FFFFFF",
        },
        warning: {
            main: "#E8E374", // Golden Yellow (richer yellow)
            light: "#F0EC92",
            dark: "#D4CF54",
            contrastText: "#1A1A1A", // Dark text for better contrast on yellow
        },
        success: {
            main: "#7BC788", // Mint Green (more vibrant green)
            light: "#96D5A1",
            dark: "#5AB368",
            contrastText: "#FFFFFF",
        },
        info: {
            main: "#6BA8C2", // Ocean Blue (deeper sky blue)
            light: "#89BBD0",
            dark: "#4E91B0",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#0A0A0A", // Very dark background
            paper: "#1A1A1A", // Slightly lighter for cards/papers
        },
        text: {
            primary: "#EDEDED",
            secondary: "#B0B0B0",
        },
    },
    typography: {
        fontFamily: "var(--font-roboto)",
    },
    cssVariables: true,
});

// Export both themes - you can switch between them based on user preference
export { lightTheme, darkTheme };
export default lightTheme; // Default to light theme
