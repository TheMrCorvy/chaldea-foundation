"use client";

import { Button } from "@mui/material";
import { FC } from "react";
import { motion } from "framer-motion";

export interface AsideHelperProps {
    markedCountries: string[];
    handleClick: (country: string | null) => void;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

const AsideHelper: FC<AsideHelperProps> = ({
    markedCountries,
    handleClick,
}) => {
    return (
        <motion.aside
            style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "transparent",
                padding: "1rem",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxHeight: "80vh",
                maxWidth: "200px",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {markedCountries.map((country) => (
                <motion.div key={country} variants={itemVariants}>
                    <Button
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
                            width: "100%",
                        }}
                    >
                        {country}
                    </Button>
                </motion.div>
            ))}
            <motion.div variants={itemVariants}>
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
                        width: "100%",
                    }}
                >
                    Clear selection
                </Button>
            </motion.div>
        </motion.aside>
    );
};

export default AsideHelper;
