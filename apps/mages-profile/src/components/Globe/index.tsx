"use client";

import { useChaldeas } from "./useChaldeas";
import { markedCountries } from "./constants";
import { Box, Button, Typography } from "@mui/material";
// import { useState } from "react";

const GlobeComponent = () => {
    // const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const { mapContainer, onCountryClick } = useChaldeas();

    const handleButtonClick = (country: string) => {
        onCountryClick(country);
    };

    return (
        <>
            <section
                ref={mapContainer}
                style={
                    {
                        // width: "fit-content",
                        // height: "fit-content",
                        // display: "flex",
                        // alignItems: "center",
                        // justifyContent: "center",
                        // position: "relative",
                    }
                }
            ></section>

            {/* Floating Countries Button Section */}
            <Box
                component="aside"
                sx={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    maxHeight: "80vh",
                    maxWidth: "200px",
                    "@media (max-width: 640px)": {
                        maxWidth: "150px",
                        padding: "0.75rem",
                        top: "0.75rem",
                        right: "0.75rem",
                    },
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                        color: "#1f2937",
                    }}
                >
                    Marked Countries
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                    }}
                >
                    {markedCountries.map((country) => (
                        <Button
                            key={country}
                            onClick={() => handleButtonClick(country)}
                            variant="contained"
                            size="small"
                            sx={{
                                color: "white",
                                border: "none",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                fontWeight: 500,
                                padding: "0.5rem 0.75rem",
                                textTransform: "none",
                                transition: "background-color 0.2s",
                            }}
                        >
                            {country}
                        </Button>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default GlobeComponent;
