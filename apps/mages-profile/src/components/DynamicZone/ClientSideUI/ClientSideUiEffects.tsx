"use client";

import GlitchButton from "../../GlitchButton";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CSSProperties } from "@mui/material";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ToggleSound from "../../ToggleSound";
import useClickAnimationAndSounds from "@/hooks/useClickAnimationAndSounds";

export interface ClientSideUiEffectsProps {
    routerPush: string;
    allowBackBtn: boolean;
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

const ClientSideUiEffects: FC<ClientSideUiEffectsProps> = ({
    routerPush,
    allowBackBtn,
}) => {
    const router = useRouter();
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

    const handleClick = () => {
        router.push(routerPush);
    };

    return (
        <>
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
                {allowBackBtn && (
                    <motion.div variants={itemVariants}>
                        <GlitchButton
                            label="Back"
                            dataSound="page_change"
                            cornerVariant="right"
                            onClick={handleClick}
                        />
                    </motion.div>
                )}
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
        </>
    );
};

export default ClientSideUiEffects;
