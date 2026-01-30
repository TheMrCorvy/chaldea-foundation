"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import GlitchButton from "../GlitchButton";

export interface AsideHelperProps {
    markedCountries: string[];
    handleClick: (country: string | null) => void;
    countrySelected: string | null;
    isMobile: boolean;
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
    countrySelected,
    isMobile,
}) => {
    return (
        <motion.aside
            style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "transparent",
                padding: isMobile ? 0 : "1rem",
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
                    <GlitchButton
                        onClick={() => handleClick(country)}
                        label={country}
                        cornerVariant="left"
                        active={countrySelected === country}
                    />
                </motion.div>
            ))}
        </motion.aside>
    );
};

export default AsideHelper;
