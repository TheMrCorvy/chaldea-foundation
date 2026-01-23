import { Box } from "@mui/material";
import Globe from "@/components/Globe";

export default function TravelPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            component="main"
        >
            <Globe />
        </Box>
    );
}
