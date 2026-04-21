import { Box, Typography } from "@mui/material";
import { LayoutLink } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicLink from "../DynamicLink";
import AddIcon from "@mui/icons-material/Add";

export interface DynamicTitleProps {
    title: string;
    color?: string;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    link_to_page?: LayoutLink | null;
    text_align?: "left" | "center" | "right";
    isMobile?: boolean;
}

const DynamicTitle: FC<DynamicTitleProps> = ({
    title,
    color,
    size = "h4",
    text_align = "center",
    link_to_page,
    isMobile,
}) => {
    const justifyContent = () => {
        switch (text_align) {
            case "left":
                return "flex-start";
            case "right":
                return "flex-end";
            default:
                return "center";
        }
    };

    const cornerIconSize = 24;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: justifyContent(),
                borderBottom: "1px solid rgba(25,118,210, 0.6)",
                pb: 2,
                gap: 2,
                verticalAlign: "center",
                alignItems: "end",
                position: "relative",
            }}
        >
            <Typography
                variant={size}
                sx={{
                    color: color || "inherit",
                    fontWeight: "bold",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
                    textAlign: text_align,
                }}
            >
                {title}
            </Typography>

            {link_to_page && (
                <>
                    <span
                        style={{
                            display: "inline-block",
                            flexGrow: isMobile ? 0 : 1,
                        }}
                    />
                    <DynamicLink {...link_to_page} />
                </>
            )}

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
        </Box>
    );
};

export default DynamicTitle;
