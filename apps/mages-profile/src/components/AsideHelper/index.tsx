"use client";

import { FC, CSSProperties } from "react";
import { motion } from "framer-motion";
import GlitchButton from "../GlitchButton";
import ToggleSound from "../ToggleSound";
import HologramGlitchText from "../HologramGlitchText";
import { Country } from "../Globe";

export interface AsideHelperProps {
    markedCountries: Country[];
    handleClick: (country: string | null) => void;
    countrySelected: string | null;
    isMobile: boolean;
    isVisible: boolean;
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
    isVisible,
}) => {
    const asideStyle: CSSProperties = {
        position: "absolute",
        backgroundColor: "transparent",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        pointerEvents: isVisible ? "auto" : "none",
    };

    return (
        <>
            <motion.aside
                style={{
                    ...asideStyle,
                    top: isMobile ? 10 : 16,
                    left: isMobile ? 10 : 16,
                    padding: isMobile ? 0 : "1rem",
                }}
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "exit"}
            >
                <motion.div key="toggle-sound" variants={itemVariants}>
                    <ToggleSound />
                </motion.div>
            </motion.aside>
            <motion.aside
                style={{
                    ...asideStyle,
                    padding: isMobile ? 0 : "1rem",
                    top: isMobile ? "75%" : "7%",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "exit"}
            >
                <motion.div key="toggle-sound" variants={itemVariants}>
                    <HologramGlitchText
                        sx={{
                            whiteSpace: "nowrap",
                            color: "#e0e0e0",
                            fontFamily: "'Geist', sans-serif",
                            textTransform: "uppercase",
                            letterSpacing: isMobile ? 1.5 : 2,
                            fontSize: isMobile ? "0.7rem" : "1rem",
                        }}
                        variant={isMobile ? "body1" : "subtitle1"}
                    >
                        Exploratio anima in cosmi somniorum
                    </HologramGlitchText>
                </motion.div>
            </motion.aside>
            <motion.aside
                style={{
                    ...asideStyle,
                    top: isMobile ? 10 : 16,
                    right: isMobile ? 10 : 16,
                    padding: isMobile ? 0 : "1rem",
                    gap: 10,
                }}
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "exit"}
            >
                {markedCountries.map((country) => (
                    <motion.div
                        key={country.country + country.label}
                        variants={itemVariants}
                    >
                        <GlitchButton
                            onClick={() => handleClick(country.country)}
                            label={country.label}
                            cornerVariant="left"
                            active={countrySelected === country.country}
                            data-sound="modal"
                        />
                    </motion.div>
                ))}
            </motion.aside>
        </>
    );
};

export default AsideHelper;
