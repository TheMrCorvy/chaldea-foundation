"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import GlitchButton from "../GlitchButton";
import ToggleSound from "../ToggleSound";

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
    exit: {
        transition: {
            staggerChildren: 0.2,
            staggerDirection: -1,
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
    exit: {
        y: -20,
        opacity: 0,
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
        <>
            <motion.aside
                style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: "transparent",
                    padding: isMobile ? 0 : "1rem",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div key="toggle-sound" variants={itemVariants}>
                    <ToggleSound />
                </motion.div>
            </motion.aside>
            <motion.aside
                style={{
                    position: "absolute",
                    top: "1%",
                    right: "1%",
                    backgroundColor: "transparent",
                    padding: isMobile ? 0 : "1rem",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
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
        </>
    );
};

export default AsideHelper;
