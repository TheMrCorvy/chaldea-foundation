"use client";

import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Globe from "@/components/Globe";

export default function TravelPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to bottom right, #0f172a via-slate-800 to-slate-900)",
                position: "relative",
            }}
        >
            <Button
                href="/"
                startIcon={<ArrowBackIcon />}
                sx={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    zIndex: 10,
                    paddingX: "1rem",
                    paddingY: "0.5rem",
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                    color: "white",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                        backgroundColor: "rgba(30, 41, 59, 0.9)",
                        borderColor: "#64748b",
                    },
                    textDecoration: "none",
                }}
            >
                Back
            </Button>

            <Box
                sx={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Globe />
            </Box>
        </Box>
    );
}
