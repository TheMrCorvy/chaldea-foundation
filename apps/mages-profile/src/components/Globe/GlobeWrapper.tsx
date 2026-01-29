"use client";

import { Suspense, FC } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { GlobeProps } from "./index";
import Loader from "../Loader";

const GlobeComponent = dynamic(
    async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const mod = await import("./index");
        return mod.default;
    },
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

const GlobeWrapper: FC<GlobeProps> = ({ isMobile }) => {
    return (
        <Suspense fallback={<GlobeLoadingFallback />}>
            <GlobeComponent isMobile={isMobile} />
        </Suspense>
    );
};

export default GlobeWrapper;
