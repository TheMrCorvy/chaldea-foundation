import AddIcon from "@mui/icons-material/Add";
import { Box, SxProps, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

export interface HologramInputFrameProps {
    children: ReactNode;
    label?: string;
    disabled?: boolean;
    sx?: SxProps;
    required?: boolean | null;
}

const cornerIconSize = 16;

const HologramInputFrame: FC<HologramInputFrameProps> = ({
    children,
    label,
    disabled,
    sx,
    required,
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                border: "1px solid rgba(25,118,210, 0.6)",
                py: 1.25,
                px: 1.5,
                background:
                    "linear-gradient(135deg, rgba(12, 36, 72, 0.75) 0%, rgba(16, 53, 91, 0.6) 45%, rgba(11, 22, 40, 0.75) 100%)",
                boxShadow:
                    "inset 0 0 22px rgba(56, 182, 255, 0.12), 0 0 16px rgba(25,118,210, 0.18)",
                backdropFilter: "blur(1px)",
                opacity: disabled ? 0.75 : 1,
                transition: "box-shadow 200ms ease",
                "&:hover": {
                    boxShadow:
                        "inset 0 0 22px rgba(56, 182, 255, 0.2), 0 0 22px rgba(56, 182, 255, 0.28)",
                },
                ...sx,
            }}
        >
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                }}
            />
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(90deg)",
                }}
            />
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(180deg)",
                }}
            />
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(270deg)",
                }}
            />

            {label && (
                <Typography
                    variant="caption"
                    sx={{
                        display: "flex",
                        mb: 0.5,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(178, 221, 255, 0.95)",
                        gap: 1,
                    }}
                >
                    <Typography component="span" color="error">
                        {required ? "*" : ""}
                    </Typography>
                    {label}
                </Typography>
            )}

            {children}
        </Box>
    );
};

export default HologramInputFrame;
