"use client";

import { Box, Stack, Typography } from "@mui/material";
import { LayoutLandingHero } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import RichTextRenderer from "../../RichTextRenderer";
import DynamicLink from "../DynamicLink";
import DynamicPdfFile from "../DynamicPdfFile";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export interface DynamicLandingHeroSectionProps extends LayoutLandingHero {
    imageBaseUrl: string;
}

const DynamicLandingHeroSection: FC<DynamicLandingHeroSectionProps> = ({
    title,
    highlighted_subtitle,
    body,
    helper_text,
    pdf_file,
    commands,
    profile_image,
    call_to_actions,
    component_id,
    imageBaseUrl,
}) => {
    return (
        <Box
            id={component_id}
            component={motion.section}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            sx={{
                width: "100%",
                maxWidth: "1800px",
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                gap: { xs: 0, md: 6, lg: 12 },
            }}
        >
            {/* Left Content / Profile and Texts */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    maxWidth: { lg: "1000px" },
                    zIndex: 2,
                    position: "relative",
                }}
            >
                {/* Profile Image Avatar */}
                {profile_image?.url && (
                    <Box
                        component={motion.div}
                        variants={itemVariants}
                        sx={{
                            width: { xs: 120, md: 150 },
                            height: { xs: 120, md: 150 },
                            borderRadius: "50%",
                            overflow: "hidden",
                            position: "relative",
                            border: "2px solid rgba(56, 182, 255, 0.7)",
                            boxShadow:
                                "0 0 25px rgba(56, 182, 255, 0.4), inset 0 0 15px rgba(56, 182, 255, 0.5)",
                            mb: 1,
                            backgroundColor: "rgba(11, 22, 40, 0.8)",
                        }}
                    >
                        <img
                            src={`${imageBaseUrl}${profile_image.url}`}
                            alt={
                                profile_image.alternativeText ||
                                "Profile Picture"
                            }
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                        {/* Avatar Scanline Overlay */}
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(rgba(25, 118, 210, 0.1) 50%, rgba(0, 0, 0, 0.1) 50%)",
                                backgroundSize: "100% 4px",
                                pointerEvents: "none",
                                zIndex: 1,
                            }}
                        />
                    </Box>
                )}

                {title && (
                    <Typography
                        component={motion.h1}
                        variants={itemVariants}
                        variant="h1"
                        sx={{
                            fontSize: {
                                xs: "1.5rem",
                                md: "2.5rem",
                                lg: "3.5rem",
                            },
                            fontWeight: 900,
                            lineHeight: 1.1,
                            color: "rgba(255, 255, 255, 0.95)",
                            textShadow: "0 0 15px rgba(56, 182, 255, 0.6)",
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {highlighted_subtitle && (
                    <Typography
                        component={motion.h2}
                        variants={itemVariants}
                        variant="h6"
                        sx={{
                            color: "#eeeeee",
                            fontWeight: 600,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            borderLeft: "4px solid rgba(56, 182, 255, 0.8)",
                            pl: 2,
                            ml: 1, // Visual adjustment to align left with text visual center
                        }}
                    >
                        {highlighted_subtitle}
                    </Typography>
                )}

                {body && body.length > 0 && (
                    <Box component={motion.div} variants={itemVariants}>
                        <RichTextRenderer
                            content={body}
                            color="rgba(178, 221, 255, 0.95)"
                        />
                    </Box>
                )}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        gap: "32px",
                    }}
                >
                    {call_to_actions &&
                        call_to_actions.length > 0 &&
                        call_to_actions?.map((cta, index) => (
                            <DynamicLink
                                key={`cta-${cta.component_id || index}`}
                                {...cta}
                                popover={cta.popover || cta.popover}
                            />
                        ))}
                </div>

                {pdf_file && (
                    <DynamicPdfFile {...pdf_file} filesBaseUrl={imageBaseUrl} />
                )}

                {helper_text && (
                    <Typography
                        component={motion.p}
                        variants={itemVariants}
                        variant="caption"
                        sx={{
                            color: "#eeeeee",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            mt: 1,
                        }}
                    >
                        {helper_text}
                    </Typography>
                )}
            </Box>

            {/* Right Content / Commands (Holographic terminal representation) */}
            <Box
                component={motion.div}
                variants={itemVariants}
                sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: { lg: "700px" },
                    position: "relative",
                    minHeight: { xs: "350px", md: "500px", lg: "700px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, md: 4 },
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at center, rgba(56, 182, 255, 0.15) 0%, transparent 60%)",
                        borderRadius: "50%",
                        filter: "blur(20px)",
                        pointerEvents: "none",
                    },
                }}
            >
                {commands?.url ? (
                    <img
                        src={`${imageBaseUrl}${commands.url}`}
                        alt={commands.alternativeText || "System Commands"}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            filter: "drop-shadow(0 0 15px rgba(56, 182, 255, 0.5))",
                            borderRadius: "8px",
                        }}
                        sizes="(max-width: 1200px) 100vw, 50vw"
                    />
                ) : (
                    <Box
                        sx={{
                            border: "1px solid rgba(56, 182, 255, 0.2)",
                            borderRadius: "15px",
                            padding: 4,
                            background: "rgba(11, 22, 40, 0.5)",
                            backdropFilter: "blur(4px)",
                            boxShadow: "inset 0 0 20px rgba(56, 182, 255, 0.1)",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "rgba(56, 182, 255, 0.4)",
                                letterSpacing: "0.2em",
                            }}
                        >
                            NO COMMANDS ESTABLISHED
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DynamicLandingHeroSection;
