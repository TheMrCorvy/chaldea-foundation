"use client";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { theme } from "./theme";

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CssVarsProvider
            theme={theme}
            defaultMode="dark"
            modeStorageKey="joy-mode"
            disableTransitionOnChange
            colorSchemeStorageKey="joy-color-scheme"
            attribute="data-joy-color-scheme"
        >
            <CssBaseline />
            {children}
        </CssVarsProvider>
    );
}
