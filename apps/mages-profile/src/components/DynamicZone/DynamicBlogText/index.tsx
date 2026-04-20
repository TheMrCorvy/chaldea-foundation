"use client";

import RichTextRenderer from "@/components/RichTextRenderer";
import { Box, Typography } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import useStyles from "./useStyles";

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

const DynamicBlogText: FC<BlogText> = ({
    body,
    font_size,
    line_height,
    color,
    title,
    component_id,
    text_align,
    highlighted_text_color,
}) => {
    const { root } = useStyles();
    return (
        <Box
            component={motion.section}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            id={component_id}
            aria-label={title || "Blog Text Section"}
            sx={root}
        >
            {title && (
                <Typography
                    variant="h4"
                    sx={{
                        color: color || undefined,
                        fontWeight: "bold",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
                    }}
                >
                    {title}
                </Typography>
            )}
            <Box
                component={motion.div}
                variants={textVariants}
                sx={{
                    textAlign: text_align || "center",
                }}
            >
                <RichTextRenderer
                    content={body}
                    fontSize={font_size || undefined}
                    lineHeight={line_height || undefined}
                    color={color || undefined}
                    highlighted_text_color={highlighted_text_color}
                />
            </Box>
        </Box>
    );
};

export default DynamicBlogText;
