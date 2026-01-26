import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

export interface StarryContainerProps {
    children: ReactNode;
}

const StarryContainer: FC<StarryContainerProps> = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                backgroundColor: "#fefefe",
            }}
            component="main"
        >
            {children}
        </Box>
    );
};

export default StarryContainer;
