import { Typography } from "@mui/material";
import { FC } from "react";

export interface DynamicTitleProps {
    title: string;
    color?: string;
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const DynamicTitle: FC<DynamicTitleProps> = ({ title, color, size = "h4" }) => {
    return (
        <Typography
            variant={size}
            sx={{
                color: color || "inherit",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
            }}
        >
            {title}
        </Typography>
    );
};

export default DynamicTitle;
