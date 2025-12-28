import { Box, Typography } from "@mui/joy";
import { FC } from "react";
import PunchHoles from "./PunchHoles";
import QRCode from "react-qr-code";
import useStyles from "./useStyles";

export interface QRComponentProps {
    value: string;
}

const QR: FC<QRComponentProps> = ({ value }) => {
    const {
        root,
        verticalText,
        qrContainer,
        invitationText,
        invitationCode,
        qrStyles,
    } = useStyles();

    return (
        <Box
            sx={root}
            component="section"
            aria-label="Código QR de la invitación"
        >
            <Typography level="h4" fontWeight="lg" sx={verticalText}>
                VÁLIDO POR UN USO
            </Typography>

            <Box sx={qrContainer}>
                <Box sx={qrStyles}>
                    <QRCode value={value} size={150} />
                    <Typography level="body-xs" textAlign="center">
                        {value}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ zIndex: 1 }}>
                <Typography level="body-xs" fontWeight="lg" sx={invitationText}>
                    CÓDIGO DE INVITACIÓN
                </Typography>
                <Typography level="h4" fontWeight="xl" sx={invitationCode}>
                    {value}
                </Typography>
            </Box>
            <PunchHoles />
        </Box>
    );
};

export default QR;
