"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import { LayoutLink, TextColors } from "@repo/type-definitions/dynamic-page";
import { FC, useState } from "react";
import DynamicLink from "../DynamicLink";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import GlitchText from "@/components/GlitchText";
import { motion } from "framer-motion";

export interface DynamicTitleProps {
    title: string;
    color?: string;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    link_to_page?: LayoutLink | null;
    text_align?: "left" | "center" | "right";
    id: number;
    link_icon_color?: TextColors | null;
    popover?: string | null;
    cycles?: number | null;
}

const DynamicTitle: FC<DynamicTitleProps> = ({
    title,
    color,
    size = "h4",
    text_align = "center",
    link_to_page,
    id,
    link_icon_color,
    popover,
    cycles = 2,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            const url = `${window.location.origin}${window.location.pathname}#section-${id}`;
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const justifyContent = () => {
        switch (text_align) {
            case "left":
                return "flex-start";
            case "right":
                return "flex-end";
            default:
                return "center";
        }
    };

    const cornerIconSize = 24;

    return (
        <Box
            id={`section-${id}`}
            component={motion.div}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row",
                },
                justifyContent: justifyContent(),
                pb: 2,
                gap: 2,
                verticalAlign: "center",
                alignItems: "end",
                position: "relative",
            }}
        >
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "rgba(25,118,210, 0.6)",
                    transformOrigin: "center",
                }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                }}
            >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <GlitchText
                        text={title}
                        color={color || "inherit"}
                        fontSize={size}
                        textAlign={text_align}
                        sx={{
                            color: color || "inherit",
                            fontWeight: "bold",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
                            textAlign: text_align,
                        }}
                        delay={0.7}
                        disableHover={false}
                        useMinus={true}
                        useSymbols={true}
                        variant={size}
                        cycles={cycles || 2}
                    />
                </Box>
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 10 : -20,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                        position: "absolute",
                        left: "100%",
                        zIndex: 0,
                        display: "flex",
                    }}
                >
                    <Tooltip
                        title={
                            copied
                                ? "Copied!"
                                : popover || "Copy link to section"
                        }
                        placement="top"
                        arrow
                    >
                        <IconButton
                            onClick={handleCopyLink}
                            size="small"
                            color={link_icon_color || "info"}
                        >
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                </motion.div>
            </motion.div>

            {link_to_page && (
                <>
                    <span
                        style={{
                            display: "inline-block",
                            flexGrow: 1,
                        }}
                    />
                    <DynamicLink {...link_to_page} />
                </>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                style={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    display: "flex",
                }}
            >
                <AddIcon
                    color="primary"
                    sx={{
                        fontSize: cornerIconSize,
                        transform: "rotate(180deg)",
                    }}
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                style={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    display: "flex",
                }}
            >
                <AddIcon
                    color="primary"
                    sx={{
                        fontSize: cornerIconSize,
                        transform: "rotate(270deg)",
                    }}
                />
            </motion.div>
        </Box>
    );
};

export default DynamicTitle;
