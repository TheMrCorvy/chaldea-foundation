"use client";

import RichTextRenderer from "@/components/RichTextRenderer";
import { Box, Typography } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";

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
}) => {
    return (
        <Box
            component={motion.section}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            id={component_id}
            aria-label={title || "Blog Text Section"}
            sx={{ marginBottom: "2rem", width: "100%", maxWidth: "1300px" }}
        >
            {title && (
                <Typography
                    component={motion.h6}
                    variants={textVariants}
                    variant="subtitle1"
                    sx={{
                        color: color || "inherit",
                        marginBottom: "1rem",
                    }}
                >
                    {title}
                </Typography>
            )}
            <Box component={motion.div} variants={textVariants}>
                <RichTextRenderer
                    content={body}
                    fontSize={font_size || undefined}
                    lineHeight={line_height || undefined}
                    color={color || undefined}
                />
            </Box>
        </Box>
    );
};

export default DynamicBlogText;
