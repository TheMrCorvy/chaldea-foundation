"use client";

import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";

export interface AsideHelperProps {
    markedCountries: string[];
    handleClick: (country: string | null) => void;
}

const AsideHelper: FC<AsideHelperProps> = ({
    markedCountries,
    handleClick,
}) => {
    return (
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
                zIndex: 2,
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
                        onClick={() => handleClick(country)}
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
                <Button
                    onClick={() => handleClick(null)}
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
                    Clear selection
                </Button>
            </Box>
        </Box>
    );
};

export default AsideHelper;
