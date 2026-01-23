import { Box } from "@mui/material";
import { GlobeWrapper } from "@/components/Globe/GlobeWrapper";

export default function TravelPage() {
    return (
        <Box
            component="main"
            sx={{
                minHeight: "100vh",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <GlobeWrapper />
        </Box>
    );
}
