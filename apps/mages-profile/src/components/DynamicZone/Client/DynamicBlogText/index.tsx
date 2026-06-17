"use client";

import RichTextRenderer from "@/components/RichTextRenderer";
import { Box } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import useStyles from "./useStyles";
import DynamicTitle from "../../Shared/DynamicTitle";

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
    id,
}) => {
    const { root } = useStyles();
    return (
        <Box
            component={motion.section}
            variants={containerVariants}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            initial="hidden"
            whileInView="visible"
            id={component_id}
            aria-label={title || "Blog Text Section"}
            sx={root}
        >
            {title && (
                <DynamicTitle
                    title={title}
                    color={color || "#eeeeee"}
                    size="h4"
                    text_align={text_align || "center"}
                    id={id}
                />
            )}
            <Box
                component={motion.div}
                variants={textVariants}
                sx={{
                    textAlign: text_align || "center",
                    mt: 4,
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
