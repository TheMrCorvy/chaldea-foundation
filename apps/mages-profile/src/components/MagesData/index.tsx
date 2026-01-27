"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Box, Divider, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

const MagesData: FC = () => {
    const isMobile = useMediaQuery().max.width("md");
    const imgSize = isMobile ? 70 : 100;

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: "absolute",
                bottom: isMobile ? 24 : 64,
                left: isMobile ? 24 : 64,
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
                        width: imgSize * 1.5,
                        height: imgSize,
                        marginRight: isMobile ? 0 : 2,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: imgSize / 4,
                            width: imgSize,
                            height: imgSize,
                            transform: "rotate(45deg)",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: "3px solid #DAA520",
                        }}
                    >
                        <Image
                            src="/profile.jpg"
                            alt="Profile"
                            width={imgSize}
                            height={imgSize}
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
                            width: imgSize / 1.8,
                            height: imgSize / 1.8,
                        }}
                    >
                        <Box
                            sx={{
                                width: imgSize / 1.8,
                                height: imgSize / 1.8,
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
                                width={imgSize / 1.8}
                                height={imgSize / 1.8}
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
                        variant={isMobile ? "h6" : "h4"}
                        sx={{ color: "white" }}
                    >
                        Gonzalo Salvador Corvalan
                    </Typography>
                    <Divider
                        sx={{ my: 0.5, borderColor: "rgba(255,255,255,0.3)" }}
                    />
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
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
