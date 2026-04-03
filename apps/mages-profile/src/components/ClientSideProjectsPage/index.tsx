"use client";

import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import GlitchButton from "../GlitchButton";
import MagicBento from "../MagicBento";
import StarryContainer from "../StarryContainer";
import { FC } from "react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { CSSProperties } from "@mui/material";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ToggleSound from "../ToggleSound";
import useClickAnimationAndSounds from "@/hooks/useClickAnimationAndSounds";

export interface ClientSideProjectsPageProps {
    projectsSection: SectionsProjectsSection;
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

const ClientSideProjectsPage: FC<ClientSideProjectsPageProps> = ({
    projectsSection,
}) => {
    const isMobile = useMediaQuery().max.width("sm");
    const asideStyle: CSSProperties = {
        position: "absolute",
        backgroundColor: "transparent",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
    };

    useClickAnimationAndSounds();

    return (
        <StarryContainer>
            <motion.aside
                style={{
                    ...asideStyle,
                    top: isMobile ? 10 : 16,
                    left: isMobile ? 10 : 16,
                    padding: isMobile ? 0 : "1rem",
                    gap: 10,
                }}
                variants={containerVariants}
                initial="hidden"
                animate={"visible"}
            >
                <motion.div variants={itemVariants}>
                    <GlitchButton
                        label="Back"
                        dataSound="page_change"
                        cornerVariant="right"
                        onClick={() => redirect("/")}
                    />
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
                animate={"visible"}
            >
                <motion.div variants={itemVariants}>
                    <ToggleSound useLeftSideBtn />
                </motion.div>
            </motion.aside>
            <section
                style={{
                    marginTop: isMobile ? "7rem" : 0,
                    marginBottom: isMobile ? "2rem" : 0,
                    padding: isMobile ? "0 1rem" : 0,
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <MagicBento
                    layout="vertical"
                    projects={projectsSection.projects || []}
                />
            </section>
        </StarryContainer>
    );
};

export default ClientSideProjectsPage;
