import { Box } from "@mui/joy";
import Invitation from "./Invitation";
import QR from "./QR";
import TicketForm from "./TicketForm";
import { FC } from "react";
import useStyles from "./useStyles";

export interface TicketLoginComponentProps {
    isRegisterForm: boolean;
    ticketCode: string;
    ticketNumber: number | string;
    userName: string;
    createdAt: Date;
}

const TicketLoginComponent: FC<TicketLoginComponentProps> = ({
    isRegisterForm,
    ticketCode,
    ticketNumber,
    userName,
    createdAt,
}) => {
    const { root, formContainer } = useStyles({ isRegisterForm });
    return (
        <Box sx={root} component="main">
            <Box
                component="article"
                aria-label="Ingresar al servicio de streaming privado"
                sx={formContainer}
            >
                <Invitation
                    isRegisterForm={isRegisterForm}
                    ticketNumber={ticketNumber}
                    createdAt={createdAt}
                    userName={userName}
                />
                <QR value={ticketCode} />
                <TicketForm
                    isRegisterForm={isRegisterForm}
                    registerToken={ticketCode}
                />
            </Box>
        </Box>
    );
};

export default TicketLoginComponent;
