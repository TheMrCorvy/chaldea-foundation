"use client";
import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

export interface StarryContainerProps {
    children: ReactNode;
}

const stars = [
    { top: "10%", left: "20%", size: 2, duration: 1.5 },
    { top: "20%", left: "80%", size: 3, duration: 2 },
    { top: "30%", left: "30%", size: 1, duration: 2.5 },
    { top: "40%", left: "70%", size: 2, duration: 1.8 },
    { top: "50%", left: "50%", size: 1, duration: 3 },
    { top: "60%", left: "10%", size: 2, duration: 2.2 },
    { top: "70%", left: "90%", size: 3, duration: 1.7 },
    { top: "80%", left: "40%", size: 1, duration: 2.8 },
    { top: "90%", left: "60%", size: 2, duration: 1.9 },
    { top: "5%", left: "5%", size: 1, duration: 2.1 },
    { top: "15%", left: "95%", size: 2, duration: 2.6 },
    { top: "25%", left: "55%", size: 1, duration: 3.2 },
    { top: "35%", left: "15%", size: 2, duration: 1.6 },
    { top: "45%", left: "85%", size: 1, duration: 2.9 },
    { top: "55%", left: "25%", size: 2, duration: 2.3 },
    { top: "65%", left: "75%", size: 1, duration: 3.1 },
    { top: "75%", left: "5%", size: 2, duration: 1.8 },
    { top: "85%", left: "95%", size: 1, duration: 2.7 },
    { top: "95%", left: "45%", size: 2, duration: 2.0 },
];

const StarryContainer: FC<StarryContainerProps> = ({ children }) => {
    return (
        <Box
            sx={{
                height: "100dvh",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                // background:
                //     "radial-gradient(ellipse 80% 50% at 60% 100%, #0A2A4D, #082E69, #001f3f)",
                background:
                    "radial-gradient(ellipse 80% 50% at 60% 100%, #051e3e, #041a33, #000d1a)",
            }}
            component="main"
            data-sound="button"
        >
            {stars.map((star, index) => (
                <motion.div
                    key={index}
                    style={{
                        position: "absolute",
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        backgroundColor: "white",
                        borderRadius: "50%",
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />
            ))}
            {children}
        </Box>
    );
};

export default StarryContainer;
