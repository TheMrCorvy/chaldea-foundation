"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <Suspense fallback={<GlobeLoadingFallback />}>
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.1,
                    clipPath: "circle(0% at 50% 50%)",
                }}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                    scale: isLoaded ? 1 : 0.1,
                    clipPath: isLoaded
                        ? "circle(100% at 50% 50%)"
                        : "circle(0% at 50% 50%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100dvh",
                    width: "100dvw",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <GlobeComponent />
            </motion.div>
        </Suspense>
    );
}
