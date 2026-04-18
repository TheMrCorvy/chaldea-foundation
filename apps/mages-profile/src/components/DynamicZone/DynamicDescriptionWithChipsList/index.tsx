"use client";

import { Box, Chip, Typography } from "@mui/material";
import { LayoutDescriptionWithChipsList } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import RichTextRenderer from "../../RichTextRenderer";
import IconComponent from "../../IconComponent";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.08,
        },
    },
};

const textVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

const chipVariants = {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.4, ease: "backOut" },
    },
};

const DynamicDescriptionWithChipsList: FC<LayoutDescriptionWithChipsList> = ({
    body,
    font_size,
    line_height,
    color,
    chips,
    title,
    text_align,
}) => {
    return (
        <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: "1300px",
                color: color || "rgba(222, 233, 241, 0.95)",
                textAlign: text_align || "center",
            }}
        >
            {title && (
                <Typography
                    component={motion.h3}
                    variants={textVariants}
                    variant="h3"
                    sx={{
                        fontWeight: "bold",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>
            )}

            <Box
                component={motion.div}
                variants={textVariants}
                sx={{
                    fontSize: font_size || "1rem",
                    lineHeight: line_height || 1.6,
                    "& p": {
                        margin: 0,
                        marginBottom: "1rem",
                    },
                    "& p:last-child": {
                        marginBottom: 0,
                    },
                }}
            >
                <RichTextRenderer
                    content={body}
                    color={color || "inherit"}
                    fontSize={font_size || "inherit"}
                    lineHeight={line_height || undefined}
                />
            </Box>

            {chips && chips.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mt: 1,
                        justifyContent:
                            chips.length === 1 ? "flex-start" : "center",
                    }}
                >
                    {chips.map((chip, index) => (
                        <motion.div
                            key={chip.component_id || `chip-${index}`}
                            variants={chipVariants}
                        >
                            <Chip
                                label={chip.title}
                                icon={
                                    chip.icon ? (
                                        <IconComponent
                                            name={chip.icon.name}
                                            size={chip.icon.size}
                                            color={chip.icon.color}
                                        />
                                    ) : undefined
                                }
                                sx={{
                                    color: "#eeeeee",
                                    backgroundColor: "rgba(12, 36, 72, 0.4)",
                                    border: "1px solid rgba(56, 182, 255, 0.3)",
                                    backdropFilter: "blur(4px)",
                                    boxShadow:
                                        "0 0 10px rgba(56, 182, 255, 0.05)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(25, 118, 210, 0.5)",
                                        borderColor: "rgba(86, 202, 255, 0.8)",
                                        boxShadow:
                                            "0 0 16px rgba(56, 182, 255, 0.4), inset 0 0 8px rgba(56, 182, 255, 0.2)",
                                        transform: "translateY(-2px)",
                                    },
                                    "& .MuiChip-label": {
                                        px: 2,
                                        py: 0.5,
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        fontSize: "0.75rem",
                                        textShadow:
                                            "0 0 8px rgba(178, 221, 255, 0.4)",
                                    },
                                    "& .MuiChip-icon": {
                                        color:
                                            chip.icon?.color &&
                                            chip.icon.color !== "inherit"
                                                ? undefined
                                                : "rgba(178, 221, 255, 0.8)",
                                        marginLeft: 1,
                                    },
                                }}
                            />
                        </motion.div>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default DynamicDescriptionWithChipsList;
