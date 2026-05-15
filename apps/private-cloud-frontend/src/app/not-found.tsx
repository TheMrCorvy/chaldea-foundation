import BottomNav from "@/components/BottomNavbar";
import { Container, Typography } from "@mui/joy";

export default function NotFound() {
    return (
        <Container
            sx={{
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Typography
                level="h1"
                component="h1"
                fontSize="xl4"
                fontWeight="bold"
                mt={4}
            >
                404 - Página No Encontrada
            </Typography>
            <Typography level="body-md" mt={2}>
                Lo sentimos, la página que estás buscando no existe.
            </Typography>
            <BottomNav mainDirectories={[]} onlyGoBack disableNavbar />
        </Container>
    );
}
