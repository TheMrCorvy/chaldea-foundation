import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
        },
        secondary: {
            main: "#dc004e",
            light: "#f05545",
            dark: "#c51162",
        },
        background: {
            default: "#fafafa",
            paper: "#ffffff",
        },
    },
    typography: {
        fontFamily:
            "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h1: {
            fontSize: "3.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: "2.5rem",
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                },
            },
        },
    },
});

export default theme;
