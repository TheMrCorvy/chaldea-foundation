"use client";

import { Suspense, FC } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { GlobeProps } from "./index";
import Loader from "../Loader";

const GlobeComponent = dynamic<GlobeProps>(
    () => import("./index").then((mod) => mod.default as any),
    {
        ssr: false,
        loading: () => <GlobeLoadingFallback />,
    }
);

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
            <Loader />
        </Box>
    );
}

const GlobeWrapper: FC<GlobeProps> = ({ isMobile, sections }) => {
    return (
        <Suspense fallback={<GlobeLoadingFallback />}>
            <GlobeComponent isMobile={isMobile} sections={sections} />
        </Suspense>
    );
};

export default GlobeWrapper;
