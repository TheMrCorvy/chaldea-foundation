"use client";

import { useEffect } from "react";
import Button from "@mui/material/Button";
import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@salvatore.hakase/log-data";

interface GlobalErrorPageProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}

export default function GlobalErrorPage({
    error,
    reset,
}: GlobalErrorPageProps) {
    useEffect(() => {
        const logType =
            process.env.NODE_ENV === "production" ? "error" : "warn";

        logData({
            title: "Global error boundary rendered",
            type: logType,
            layer: "*",
            timeStamp: true,
            data: {
                statusCode: 500,
                description:
                    "Unhandled exception captured by Next.js error boundary.",
                digest: error.digest,
            },
        });
    }, [error.digest]);

    return (
        <StatusErrorPage
            statusCode={500}
            title="Unexpected Error"
            description="An unexpected issue occurred while loading this view. Please try again."
            accentColor="#616161"
            accentSoftColor="#ECECEC"
            backgroundTop="#FAFAFA"
            backgroundBottom="#D9D9D9"
            details="A protected fallback has been shown to avoid exposing internal details."
            secondaryAction={
                <Button
                    variant="outlined"
                    size="large"
                    onClick={reset}
                    sx={{
                        borderColor: "#616161",
                        color: "#424242",
                        fontWeight: 700,
                    }}
                >
                    Try again
                </Button>
            }
        />
    );
}
