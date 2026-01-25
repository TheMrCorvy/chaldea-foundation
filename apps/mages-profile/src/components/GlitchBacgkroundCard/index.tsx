import React, { useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const generateRandomString = (length: number): string => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const GlitchBackgroundCard: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setText(generateRandomString(2000));
        },
        []
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        setText(generateRandomString(2000));
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, []);

    const cardSize = 450;
    const cornerIconSize = 24;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
                overflow: "hidden",
                bgcolor: "rgb(2, 6, 23)",
            }}
        >
            <Box
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    position: "relative",
                    width: cardSize,
                    height: cardSize,
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    overflow: "visible",
                    cursor: "pointer",
                    "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        zIndex: -1,
                    },
                    // Vertical line
                    "&::before": {
                        width: "1px",
                        height: "100vh",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    },
                    // Horizontal line
                    "&::after": {
                        height: "1px",
                        width: "100vw",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    },
                }}
            >
                {/* Corner Icons */}
                <AddIcon
                    sx={{
                        position: "absolute",
                        top: -cornerIconSize / 2,
                        left: -cornerIconSize / 2,
                        color: "white",
                        fontSize: cornerIconSize,
                    }}
                />
                <AddIcon
                    sx={{
                        position: "absolute",
                        top: -cornerIconSize / 2,
                        right: -cornerIconSize / 2,
                        color: "white",
                        fontSize: cornerIconSize,
                        transform: "rotate(90deg)",
                    }}
                />
                <AddIcon
                    sx={{
                        position: "absolute",
                        bottom: -cornerIconSize / 2,
                        right: -cornerIconSize / 2,
                        color: "white",
                        fontSize: cornerIconSize,
                        transform: "rotate(180deg)",
                    }}
                />
                <AddIcon
                    sx={{
                        position: "absolute",
                        bottom: -cornerIconSize / 2,
                        left: -cornerIconSize / 2,
                        color: "white",
                        fontSize: cornerIconSize,
                        transform: "rotate(270deg)",
                    }}
                />

                {/* Glitch Text with Gradient Mask */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "2.5%",
                        left: "2.5%",
                        width: "95%",
                        height: "95%",
                        color: "transparent",
                        overflow: "hidden",
                        wordWrap: "break-word",
                        lineHeight: 1.2,
                        fontSize: "14px",
                        fontWeight: 500,
                        textAlign: "justify",
                        opacity: isHovering ? 1 : 0,
                        transition: "opacity 300ms ease-out",
                        background: `radial-gradient(
                            circle at ${mousePosition.x}px ${mousePosition.y}px,
                            rgba(154, 98, 181, 0.5) 20%,
        rgba(41, 121, 255, 0.5) 30%,
        rgba(56, 182, 255, 0.5) 50%,
        rgba(42, 252, 152, 0.5)
                        )`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        borderRadius: 6,
                    }}
                >
                    {text}
                </Box>

                {/* Inner element */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        // transform: "translate(-50%, -50%)",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "16px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                            borderRadius: 2,
                            color: "white",
                            margin: "11px",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            // backdropFilter: "blur(0.5px)",
                            wordBreak: "break-word",
                        }}
                    >
                        {/* <AddIcon sx={{ color: "white", fontSize: 40 }} /> */}
                        <Typography>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Sapiente ea ullam aperiam, deleniti odit
                            maiores reiciendis molestias ut rerum quidem eos,
                            dolorum officiis nisi nesciunt. Expedita accusamus
                            eos fuga vel.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default GlitchBackgroundCard;
