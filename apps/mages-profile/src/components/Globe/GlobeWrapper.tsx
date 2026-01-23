"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Box, CircularProgress } from "@mui/material";

const GlobeComponent = dynamic(() => import("./index"), {
    ssr: false,
    loading: () => <GlobeLoadingFallback />,
});

function GlobeLoadingFallback() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export function GlobeWrapper() {
    return (
        <Suspense fallback={<GlobeLoadingFallback />}>
            <GlobeComponent />
        </Suspense>
    );
}
