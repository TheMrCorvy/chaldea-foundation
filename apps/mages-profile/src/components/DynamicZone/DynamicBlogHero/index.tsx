"use client";

import { BlogHero } from "@repo/type-definitions/dynamic-page";
import { FC, MouseEvent, useRef } from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import RichTextRenderer from "../../RichTextRenderer";
import styles from "./DynamicBlogHero.module.css";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const cornerIconSize = 24;

const DynamicBlogHero: FC<BlogHero> = ({ body, cover_image, title }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <Box
            component={motion.section}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={styles.heroContainer}
            sx={{
                position: "relative",
                width: "100%",
                maxWidth: "1500px",
                margin: "0 auto",
                border: "1px solid rgba(25,118,210, 0.4)",
                background:
                    "linear-gradient(135deg, rgba(8, 20, 40, 0.8) 0%, rgba(12, 36, 72, 0.7) 100%)",
                boxShadow:
                    "inset 0 0 20px rgba(56, 182, 255, 0.1), 0 0 15px rgba(25,118,210, 0.15)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow:
                        "inset 0 0 25px rgba(56, 182, 255, 0.2), 0 0 25px rgba(56, 182, 255, 0.25)",
                },
            }}
        >
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    zIndex: 10,
                }}
            />
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(90deg)",
                    zIndex: 10,
                }}
            />
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(180deg)",
                    zIndex: 10,
                }}
            />
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(270deg)",
                    zIndex: 10,
                }}
            />

            <Box
                sx={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    minHeight: "450px",
                }}
            >
                {/* Text Content */}
                <Box
                    sx={{
                        flex: 1,
                        p: { xs: 4, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        position: "relative",
                        gap: 3,
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            right: 0,
                            top: "10%",
                            bottom: "10%",
                            width: "1px",
                            background:
                                "linear-gradient(to bottom, transparent, rgba(56,182,255,0.4), transparent)",
                            display: { xs: "none", md: "block" },
                        },
                    }}
                >
                    {title && (
                        <Typography
                            variant="h2"
                            sx={{
                                mb: 2,
                                color: "rgba(178, 221, 255, 0.95)",
                                fontSize: { xs: "1.5rem", md: "2.5rem" },
                                fontWeight: "bold",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                            }}
                        >
                            {title}
                        </Typography>
                    )}
                    {body && (
                        <RichTextRenderer
                            content={body}
                            color="rgba(178, 221, 255, 0.95)"
                        />
                    )}
                </Box>

                {/* Image Hologram View */}
                <Box
                    sx={{
                        flex: 1,
                        position: "relative",
                        minHeight: { xs: "300px", md: "auto" },
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "radial-gradient(circle at center, rgba(56, 182, 255, 0.1) 0%, transparent 70%)",
                    }}
                >
                    {cover_image?.url ? (
                        <Image
                            src={cover_image.url}
                            alt={cover_image.name || "Hero Banner"}
                            fill
                            style={{
                                objectFit: "cover",
                                opacity: 0.85,
                                mixBlendMode: "screen",
                            }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "rgba(56, 182, 255, 0.3)",
                            }}
                        >
                            <Typography
                                sx={{
                                    letterSpacing: "0.2em",
                                    fontWeight: "bold",
                                }}
                            >
                                NO DATA STREAM DETECTED
                            </Typography>
                        </Box>
                    )}

                    {/* Scanline overlay for that retro-futuristic Chaldea tech vibe */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(rgba(25, 118, 210, 0.05) 50%, rgba(0, 0, 0, 0.1) 50%)",
                            backgroundSize: "100% 4px",
                            pointerEvents: "none",
                            zIndex: 3,
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default DynamicBlogHero;
