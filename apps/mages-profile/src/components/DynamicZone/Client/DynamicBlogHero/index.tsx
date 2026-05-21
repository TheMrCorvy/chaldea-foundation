"use client";

import { BlogHero } from "@repo/type-definitions/dynamic-page";
import { FC, MouseEvent, useRef } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import RichTextRenderer from "../../../RichTextRenderer";
import DynamicLink from "../../Shared/DynamicLink";
import styles from "./DynamicBlogHero.module.css";
import useStyles from "./useStyles";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const cornerIconSize = 24;

export interface DynamicBlogHeroProps extends BlogHero {
    imageBaseUrl: string;
}

const DynamicBlogHero: FC<DynamicBlogHeroProps> = ({
    body,
    cover_image,
    title,
    link_to_page,
    highlighted_text_color,
    imageBaseUrl,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const {
        root,
        textContainer,
        textContent,
        title: titleStyles,
        hologramImage,
        noImage,
        noData,
        divider,
    } = useStyles();

    return (
        <Box
            component={motion.section}
            variants={containerVariants}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            initial="hidden"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={styles.heroContainer}
            sx={root}
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

            <Box sx={textContainer}>
                <Box sx={textContent}>
                    {title && (
                        <Typography variant="h2" sx={titleStyles}>
                            {title}
                        </Typography>
                    )}
                    {body && (
                        <RichTextRenderer
                            content={body}
                            color="rgba(178, 221, 255, 0.95)"
                            highlighted_text_color={highlighted_text_color}
                        />
                    )}
                    {link_to_page && (
                        <Box sx={{ mt: 2, color: "#f3f3f3" }}>
                            <DynamicLink {...link_to_page} />
                        </Box>
                    )}
                </Box>
                <Box sx={hologramImage}>
                    {cover_image?.url ? (
                        <img
                            src={`${imageBaseUrl}${cover_image.url}`}
                            alt={cover_image.name || "Hero Banner"}
                            style={{
                                objectFit: "cover",
                                opacity: 0.85,
                                mixBlendMode: "screen",
                                borderRadius: "8px",
                            }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <Box sx={noImage}>
                            <Typography sx={noData}>
                                NO DATA STREAM DETECTED
                            </Typography>
                        </Box>
                    )}
                    <Box sx={divider} />
                </Box>
            </Box>
        </Box>
    );
};

export default DynamicBlogHero;
