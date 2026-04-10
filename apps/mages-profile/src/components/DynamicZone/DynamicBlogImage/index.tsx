"use client";

import { Box, Typography } from "@mui/material";
import { BlogImageComponent } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const DynamicBlogImage: FC<BlogImageComponent> = ({
    component_id,
    title,
    alt,
    width,
    height,
    body,
    image,
}) => {
    return (
        <Box
            id={component_id}
            component={motion.figure}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: width ? `${width}px` : "1000px",
                margin: "0 auto",
                py: { xs: 4, md: 6 },
                px: { xs: 2, sm: 4 },
                gap: 2,
            }}
        >
            {title && (
                <Typography
                    variant="h5"
                    sx={{
                        color: "#eeeeee",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        alignSelf: "flex-start",
                        mb: 1,
                        borderLeft: "3px solid rgba(56, 182, 255, 0.8)",
                        pl: 2,
                    }}
                >
                    {title}
                </Typography>
            )}

            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio:
                        width && height ? `${width} / ${height}` : "16 / 9",
                    maxWidth: "100%",
                    border: "1px solid rgba(56, 182, 255, 0.3)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "rgba(8, 20, 40, 0.6)",
                    boxShadow:
                        "0 0 25px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(56, 182, 255, 0.15)",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at center, rgba(56, 182, 255, 0.1) 0%, transparent 70%)",
                        pointerEvents: "none",
                        zIndex: 1,
                    },
                }}
            >
                {image?.url ? (
                    <Image
                        src={image.url}
                        alt={
                            alt ||
                            image.alternativeText ||
                            title ||
                            "Hologram Image Data"
                        }
                        fill
                        style={{
                            objectFit: "cover",
                            opacity: 0.85,
                            mixBlendMode: "screen",
                        }}
                        sizes="(max-width: 1200px) 100vw, 80vw"
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
                            NO VISUAL DATA
                        </Typography>
                    </Box>
                )}

                {/* Scanline overlay for the holographic effect */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(rgba(25, 118, 210, 0.08) 50%, rgba(0, 0, 0, 0.15) 50%)",
                        backgroundSize: "100% 4px",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}
                />
            </Box>

            {body && (
                <Typography
                    component="figcaption"
                    variant="body2"
                    sx={{
                        color: "rgba(178, 221, 255, 0.7)",
                        fontStyle: "italic",
                        textAlign: "center",
                        mt: 1,
                        maxWidth: "85%",
                        letterSpacing: "0.05em",
                    }}
                >
                    {body}
                </Typography>
            )}
        </Box>
    );
};

export default DynamicBlogImage;
