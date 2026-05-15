import BottomNav from "@/components/BottomNavbar";
import { Container, Typography } from "@mui/joy";

export default function PendingActivation() {
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
                Tu usuario ha sido registrado con éxito!
            </Typography>
            <Typography level="body-md" mt={2}>
                Contáctate con el administrador del sitio para que tu rol sea
                asignado.
            </Typography>
            <BottomNav mainDirectories={[]} disableNavbar />
        </Container>
    );
}
