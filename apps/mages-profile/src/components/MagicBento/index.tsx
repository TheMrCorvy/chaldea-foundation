"use client";

import React, { useRef, MouseEvent } from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { LayoutProjectListItem } from "@repo/type-definitions/dynamic-page";
import { motion } from "framer-motion";
import styles from "./MagicBento.module.css";
import RichTextRenderer from "../RichTextRenderer";
import IconComponent from "../IconComponent";

interface MagicBentoProps {
    layout?: "vertical" | "horizontal";
    projects: LayoutProjectListItem[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const MagicBento: React.FC<MagicBentoProps> = ({
    layout = "horizontal",
    projects = [],
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const cards = containerRef.current.getElementsByClassName(styles.card);

        for (const card of Array.from(cards)) {
            const htmlCard = card as HTMLElement;
            const rect = htmlCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            htmlCard.style.setProperty("--mouse-x", `${x}px`);
            htmlCard.style.setProperty("--mouse-y", `${y}px`);
        }
    };

    return (
        <motion.div
            ref={containerRef}
            className={`${styles.cards} ${layout === "vertical" ? styles.vertical_grid : styles.horizontal_grid}`}
            onMouseMove={handleMouseMove}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            {projects.map((project, i) => {
                const firstLink = project.links?.[0];
                const otherLinks = project.links?.slice(1) || [];

                return (
                    <motion.div
                        key={project.component_id || i}
                        className={styles.card}
                        variants={cardVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <div className={styles.cardContent}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                    width: "100%",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    p: 2,
                                }}
                            >
                                <Box sx={{ width: "100%" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.9)",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {project.title}
                                        </Typography>
                                        {firstLink && (
                                            <MuiLink
                                                href={firstLink.href}
                                                underline="none"
                                                sx={{
                                                    color: "rgba(255, 255, 255, 0.6)",
                                                    display: "flex",
                                                    padding: "8px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        "rgba(255, 255, 255, 0.05)",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        color: "#ffffff",
                                                        backgroundColor:
                                                            "rgba(255, 255, 255, 0.15)",
                                                        transform:
                                                            "scale(1.05)",
                                                    },
                                                }}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <CallMadeIcon fontSize="small" />
                                            </MuiLink>
                                        )}
                                    </Box>
                                    <RichTextRenderer
                                        content={project.body.body}
                                        color="rgba(255, 255, 255, 0.7)"
                                        fontSize="0.8rem"
                                        lineHeight={1.3}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                    }}
                                >
                                    {otherLinks.map((link, j) => (
                                        <MuiLink
                                            key={j}
                                            href={link.href}
                                            underline="none"
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "0.85rem",
                                                fontWeight: 500,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                transition: "all 0.2s ease",
                                                padding: "3px 10px",
                                                borderRadius: "10px",
                                                backgroundColor:
                                                    "rgba(255, 255, 255, 0.05)",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                "&:hover": {
                                                    color: "#ffffff",
                                                },
                                            }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.label}
                                            <IconComponent
                                                icon="Link"
                                                size="small"
                                            />
                                        </MuiLink>
                                    ))}
                                </Box>
                            </Box>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default MagicBento;
