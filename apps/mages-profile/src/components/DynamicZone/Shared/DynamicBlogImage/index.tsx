"use client";

import { Box, Button, Dialog, Typography } from "@mui/material";
import { BlogImageComponent } from "@repo/type-definitions/dynamic-page";
import { FC, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useStyles from "./useStyles";

export interface DynamicBlogImageProps extends BlogImageComponent {
    imageBaseUrl: string;
}

const DynamicBlogImage: FC<DynamicBlogImageProps> = ({
    component_id,
    title,
    alt,
    width,
    height,
    body,
    image,
    imageBaseUrl,
}) => {
    const [expanded, setExpanded] = useState(false);
    const {
        root,
        titleStyles,
        imageContainer,
        noVisualData,
        divider,
        bodyStyles,
    } = useStyles();

    const aspectRatio =
        width && height
            ? `${width} / ${height}`
            : image?.width && image?.height
              ? `${image.width} / ${image.height}`
              : "16 / 9";

    return (
        <>
            <Box
                id={component_id}
                component={motion.figure}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ flex: 1, width: "100%" }}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                sx={{
                    ...root,
                    maxWidth: width ? `${width}px` : "1000px",
                }}
            >
                {title && (
                    <Typography variant="h5" sx={titleStyles}>
                        {title}
                    </Typography>
                )}

                <Button
                    onClick={() => image?.url && setExpanded(true)}
                    disableRipple={!image?.url}
                    sx={{
                        p: 0,
                        width: "100%",
                        display: "block",
                        lineHeight: 0,
                        textAlign: "center",
                        cursor: image?.url ? "pointer" : "default",
                        aspectRatio,
                        ...imageContainer,
                    }}
                >
                    {image?.url ? (
                        <Image
                            src={imageBaseUrl + image.url}
                            alt={
                                alt ||
                                image.alternativeText ||
                                title ||
                                "Hologram Image Data"
                            }
                            fill
                            style={{
                                objectFit: "contain",
                                opacity: 0.85,
                                mixBlendMode: "screen",
                            }}
                            sizes="(max-width: 1200px) 100vw, 80vw"
                        />
                    ) : (
                        <Box sx={noVisualData}>
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
                    <Box sx={divider} />
                </Button>

                {body && (
                    <Typography
                        component="figcaption"
                        variant="body2"
                        sx={bodyStyles}
                    >
                        {body}
                    </Typography>
                )}
            </Box>

            {image?.url && (
                <Dialog
                    open={expanded}
                    onClose={() => setExpanded(false)}
                    maxWidth={false}
                    slotProps={{
                        backdrop: {
                            sx: { backgroundColor: "rgba(0, 0, 0, 0.85)" },
                        },
                    }}
                    PaperProps={{
                        sx: {
                            background: "transparent",
                            boxShadow: "none",
                            overflow: "visible",
                            m: 0,
                            p: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    }}
                    sx={{
                        "& .MuiDialog-container": {
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    }}
                >
                    <Button
                        onClick={() => setExpanded(false)}
                        sx={{
                            p: 0,
                            cursor: "pointer",
                            display: "block",
                            lineHeight: 0,
                            textAlign: "center",
                            position: "relative",
                            aspectRatio,
                            maxWidth: "100vw",
                            maxHeight: "100dvh",
                            width: `min(100vw, 100dvh * (${aspectRatio.replace(" / ", " / ")}))`,
                            height: "auto",
                        }}
                    >
                        <Image
                            src={imageBaseUrl + image.url}
                            alt={
                                alt ||
                                image.alternativeText ||
                                title ||
                                "Hologram Image Data"
                            }
                            fill
                            style={{ objectFit: "contain" }}
                            sizes="100vw"
                        />
                    </Button>
                </Dialog>
            )}
        </>
    );
};

export default DynamicBlogImage;
