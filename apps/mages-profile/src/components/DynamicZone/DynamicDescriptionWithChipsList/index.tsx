"use client";

import { Box } from "@mui/material";
import { LayoutDescriptionWithChipsList } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import RichTextRenderer from "../../RichTextRenderer";
import ChipsRenderer from "./ChipsRenderer";
import DynamicTitle from "../DynamicTitle";

export interface DynamicDescriptionWithChipsListProps extends LayoutDescriptionWithChipsList {
    isMobile?: boolean;
}

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

const DynamicDescriptionWithChipsList: FC<
    DynamicDescriptionWithChipsListProps
> = ({
    body,
    font_size,
    line_height,
    color,
    chips,
    title,
    text_align,
    highlighted_text_color,
    logo_loop,
    isMobile,
    vertical_logo_loop,
    component_id,
    id,
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
                <DynamicTitle
                    title={title}
                    color={color || "#eeeeee"}
                    size="h4"
                    text_align={text_align || "center"}
                    isMobile={isMobile}
                    id={id}
                />
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
                    highlighted_text_color={highlighted_text_color}
                />
            </Box>

            <ChipsRenderer
                chips={chips}
                logo_loop={logo_loop}
                isMobile={isMobile}
                vertical_logo_loop={vertical_logo_loop}
                component_id={component_id}
            />
        </Box>
    );
};

export default DynamicDescriptionWithChipsList;
