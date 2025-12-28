import { Box, Typography } from "@mui/joy";
import { FC } from "react";
import useStyles from "./useStyles";

export interface InvitationProps {
    isRegisterForm: boolean;
    ticketNumber: number | string;
    createdAt?: Date;
    userName?: string;
}

const Invitation: FC<InvitationProps> = ({
    isRegisterForm,
    ticketNumber,
    createdAt,
    userName,
}) => {
    const date = createdAt ? new Date(createdAt) : new Date();
    const currentDate = new Intl.DateTimeFormat("es-AR").format(date);
    const styles = useStyles({ isRegisterForm });

    return (
        <Box
            component="section"
            aria-label="Idetalles de la invitación"
            sx={styles.root}
        >
            <Typography component="h1" sx={styles.title}>
                Ticket Número:
                <Typography
                    component="span"
                    color="primary"
                    sx={styles.ticketNumber}
                >
                    {ticketNumber}
                </Typography>
            </Typography>
            <Typography level="body-md" color="primary" sx={styles.date}>
                Fecha de creación: {currentDate}
            </Typography>

            {isRegisterForm && userName && (
                <Box sx={styles.userContainer}>
                    <Typography
                        level="body-md"
                        fontSize="var(--joy-fontSize-xl3)"
                        fontWeight="bold"
                        sx={styles.userName}
                    >
                        {userName}
                    </Typography>
                </Box>
            )}

            <Box
                component="img"
                src="/kiyohime.webp"
                alt="Kiyohime"
                sx={styles.image}
            />
        </Box>
    );
};

export default Invitation;
