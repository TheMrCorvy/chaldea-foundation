import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { FC } from "react";

export interface PostImagePlaceHolderProps {
    height?: number | string;
    width?: number | string;
    roundedBorders?: boolean;
}

const PostImagePlaceHolder: FC<PostImagePlaceHolderProps> = ({
    height,
    width,
    roundedBorders = false,
}) => {
    return (
        <Box
            sx={{
                height: height || 150,
                width: width || "100%",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: roundedBorders ? "8px" : "0px",
                background:
                    "radial-gradient(circle at 20% 30%, rgba(66, 165, 245, 0.22), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255, 160, 0, 0.2), transparent 58%), linear-gradient(160deg, rgba(12, 27, 44, 0.94), rgba(13, 40, 64, 0.7))",
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    color: "rgba(226, 241, 255, 0.86)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                }}
            >
                CHALDEA ARCHIVE FEED
            </Typography>
        </Box>
    );
};

export default PostImagePlaceHolder;
