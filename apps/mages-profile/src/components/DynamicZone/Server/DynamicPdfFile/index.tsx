"use server";

import { Box, Button, Tooltip, Typography } from "@mui/material";
import { StrapiPDFComponent } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import IconComponent from "../../../IconComponent";

export interface DynamicPdfFileProps extends StrapiPDFComponent {
    filesBaseUrl: string;
}

const DynamicPdfFile: FC<DynamicPdfFileProps> = ({
    title,
    popover,
    helper_text,
    file,
    icon,
    component_id,
    filesBaseUrl,
}) => {
    const fileObj = file as { url?: string; name?: string } | null;
    const fileUrl = fileObj?.url ? `${filesBaseUrl}${fileObj.url}` : undefined;

    const buttonContent = (
        <Button
            component="a"
            href={fileUrl || "#"}
            target={fileUrl ? "_blank" : undefined}
            rel={fileUrl ? "noopener noreferrer" : undefined}
            download={fileUrl ? true : undefined}
            disabled={!fileUrl}
            sx={{
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
            {icon && (
                <IconComponent {...icon} id={`icon-for-${component_id}`} />
            )}
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
            sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
                mb: 3,
            }}
        >
            {contentWithTooltip}

            {helper_text && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "rgba(146, 232, 255, 0.6)",
                        letterSpacing: "0.05em",
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
