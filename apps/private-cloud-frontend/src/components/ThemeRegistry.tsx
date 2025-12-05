"use client";

import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CssVarsProvider>
            <CssBaseline />
            {children}
        </CssVarsProvider>
    );
}
