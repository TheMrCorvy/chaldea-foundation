"use client";

import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
    code: string;
    language?: string;
}

const CopyIcon: FC = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const CheckIcon: FC = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CodeBlock: FC<CodeBlockProps> = ({ code, language }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const normalizedLanguage = language ? language.toLowerCase().trim() : "tsx";

    return (
        <Box
            sx={{
                position: "relative",
                my: 6,
                borderRadius: 2,
                overflow: "hidden",
                maxWidth: "95dvw",
                border: "1px solid",
                borderColor: "rgba(56, 182, 255, 0.3)",
                background:
                    "radial-gradient(ellipse 80% 50% at 50% 100%, #051e3e, #041a33, #000d1a)",
                boxShadow:
                    "0 0 25px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(56, 182, 255, 0.15)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at center, rgba(56, 182, 255, 0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 1,
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(rgba(25, 118, 210, 0.08) 50%, rgba(0, 0, 0, 0.15) 50%)",
                    backgroundSize: "100% 4px",
                    pointerEvents: "none",
                    zIndex: 2,
                },
                "&:hover": {
                    boxShadow:
                        "0 0 30px rgba(56, 182, 255, 0.25), inset 0 0 20px rgba(56, 182, 255, 0.2)",
                    borderColor: "info.main",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    bgcolor: "rgba(8, 20, 40, 0.8)",
                    borderBottom: "1px solid",
                    borderColor: "rgba(56, 182, 255, 0.2)",
                    position: "relative",
                    zIndex: 3,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        color: "rgba(178, 221, 255, 0.8)",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        fontSize: "0.75rem",
                    }}
                >
                    {normalizedLanguage}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {copied && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: "success.light",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                            }}
                        >
                            Copied!
                        </Typography>
                    )}
                    <Box
                        component="button"
                        onClick={handleCopy}
                        aria-label={copied ? "Copied" : "Copy code"}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            bgcolor: "transparent",
                            color: copied ? "success.light" : "grey.400",
                            cursor: "pointer",
                            p: 0.5,
                            borderRadius: 1,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                color: copied ? "success.light" : "info.light",
                                bgcolor: "rgba(56, 182, 255, 0.12)",
                            },
                            "&:active": {
                                transform: "scale(0.95)",
                            },
                        }}
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                    </Box>
                </Box>
            </Box>

            <Highlight
                theme={themes.vsDark}
                code={code.trim()}
                language={normalizedLanguage}
            >
                {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                }) => (
                    // Scroll wrapper: scoped to the code area only, so the header bar stays full-width
                    <Box
                        sx={{
                            overflowX: "auto",
                            position: "relative",
                            zIndex: 3,
                        }}
                    >
                        <Box
                            component="pre"
                            className={className}
                            style={{
                                ...style,
                                backgroundColor: "transparent",
                                margin: 0,
                                padding: "16px",
                                whiteSpace: "pre",
                                fontSize: "0.875rem",
                                lineHeight: 1.6,
                                fontFamily:
                                    "Fira Code, JetBrains Mono, source-code-pro, Menlo, Monaco, Consolas, monospace",
                            }}
                        >
                            {tokens.map((line, i) => (
                                <Box
                                    key={i}
                                    {...getLineProps({ line })}
                                    sx={{
                                        display: "flex",
                                        "&:hover": {
                                            bgcolor: "rgba(56, 182, 255, 0.04)",
                                        },
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-block",
                                            width: "2em",
                                            textAlign: "right",
                                            pr: 2,
                                            userSelect: "none",
                                            color: "rgba(178, 221, 255, 0.4)",
                                            fontSize: "0.8rem",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {i + 1}
                                    </Box>
                                    <Box
                                        component="span"
                                        sx={{ flex: 1, pr: 2 }}
                                    >
                                        {line.map((token, key) => (
                                            <span
                                                key={key}
                                                {...getTokenProps({ token })}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Highlight>
        </Box>
    );
};

export default CodeBlock;
