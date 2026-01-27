"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Box, Divider, Typography, TypographyVariant } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

const MagesData: FC = () => {
    const isMobile = useMediaQuery().max.width("sm");
    const isTablet = useMediaQuery().max.width("md");

    const getImageSize = (): number => {
        if (isMobile) {
            return 50;
        }
        if (isTablet) {
            return 70;
        }
        return 100;
    };

    const imageSize = getImageSize();

    const buildVariants = () => {
        if (isMobile) {
            return {
                name: "subtitle1",
                profession: "body2",
            };
        }
        if (isTablet) {
            return {
                name: "h6",
                profession: "subtitle1",
            };
        }

        return {
            name: "h4",
            profession: "h6",
        };
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: "absolute",
                bottom: isMobile ? 16 : 64,
                left: isMobile ? 16 : 64,
                zIndex: 10,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: imageSize * 1.5,
                        height: imageSize,
                        marginRight: isMobile ? 0 : 2,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: imageSize / 4,
                            width: imageSize,
                            height: imageSize,
                            transform: "rotate(45deg)",
                            overflow: "hidden",
                            borderRadius: "8px",
                            // boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                            // Add a golden border 2px solid with golden box-shadow
                            border: "3px solid #DAA520",
                            // boxShadow:
                            //     "0 0 10px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.6)",
                        }}
                    >
                        <Image
                            src="/profile.jpg"
                            alt="Profile"
                            width={imageSize}
                            height={imageSize}
                            style={{
                                transform: "rotate(-45deg) scale(1.4)",
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: isMobile ? -5 : -15,
                            transform: "translateY(-50%)",
                            zIndex: 1,
                            width: imageSize / 1.8,
                            height: imageSize / 1.8,
                        }}
                    >
                        <Box
                            sx={{
                                width: imageSize / 1.8,
                                height: imageSize / 1.8,
                                transform: "rotate(45deg)",
                                bgcolor: "rgba(0,0,0,0.8)",
                                overflow: "hidden",
                                borderRadius: "4px",
                                border: "2px solid #C0C0C0",
                                p: 0.3,
                            }}
                        >
                            <Image
                                src="/command_spells.svg"
                                alt="Command Spells"
                                width={imageSize / 1.8}
                                height={imageSize / 1.8}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    transform: "rotate(-45deg) scale(1.4)",
                                    filter: "brightness(1.2) saturate(1.8)",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", mt: -1 }}>
                    <Typography
                        variant={buildVariants().name as TypographyVariant}
                        sx={{ color: "white" }}
                    >
                        Gonzalo Salvador Corvalan
                    </Typography>
                    <Divider
                        sx={{ my: 0.5, borderColor: "rgba(255,255,255,0.3)" }}
                    />
                    <Typography
                        variant={
                            buildVariants().profession as TypographyVariant
                        }
                        sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                        Fullstack Developer
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default MagesData;
