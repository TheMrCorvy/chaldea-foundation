"use client";

import { Box, Button, Tooltip, Typography } from "@mui/material";
import { StrapiPDFComponent } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import IconComponent from "../../IconComponent";

const DynamicPdfFile: FC<StrapiPDFComponent> = ({
    title,
    popover,
    helper_text,
    file,
    icon,
    component_id,
}) => {
    // Safely extract URL from the unknown 'file' prop
    const fileObj = file as { url?: string; name?: string } | null;
    const fileUrl = fileObj?.url;

    const buttonContent = (
        <Button
            component={motion.a}
            href={fileUrl || "#"}
            target={fileUrl ? "_blank" : undefined}
            rel={fileUrl ? "noopener noreferrer" : undefined}
            download={fileUrl ? true : undefined}
            disabled={!fileUrl}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                border: "1px solid rgba(56, 182, 255, 0.5)",
                borderRadius: "4px",
                px: 3,
                py: 1.5,
                backgroundColor: "rgba(11, 22, 40, 0.6)",
                color: "rgba(178, 221, 255, 1)",
                textTransform: "none",
                boxShadow: "inset 0 0 10px rgba(56, 182, 255, 0.2)",
                backdropFilter: "blur(4px)",
                transition:
                    "box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: "rgba(16, 53, 91, 0.8)",
                    borderColor: "rgba(56, 182, 255, 0.8)",
                    boxShadow:
                        "inset 0 0 15px rgba(56, 182, 255, 0.4), 0 0 15px rgba(56, 182, 255, 0.3)",
                },
                "&.Mui-disabled": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(11, 22, 40, 0.3)",
                },
            }}
        >
            {icon && <IconComponent {...icon} />}
            <Typography
                sx={{
                    fontWeight: "bold",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                }}
            >
                {title || "Download Document"}
            </Typography>
        </Button>
    );

    const contentWithTooltip = popover ? (
        <Tooltip title={popover} placement="top" arrow>
            <Box display="inline-block">{buttonContent}</Box>
        </Tooltip>
    ) : (
        buttonContent
    );

    return (
        <Box
            id={component_id}
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                gap: 1,
                width: { xs: "100%", sm: "auto" },
            }}
        >
            {contentWithTooltip}

            {helper_text && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "rgba(146, 232, 255, 0.6)",
                        letterSpacing: "0.05em",
                        textAlign: { xs: "center", sm: "left" },
                        maxWidth: "100%",
                        mt: 0.5,
                        textTransform: "uppercase",
                    }}
                >
                    {helper_text}
                </Typography>
            )}
        </Box>
    );
};

export default DynamicPdfFile;
