"use client";

import { FC, useActionState, useRef, useState } from "react";
import {
    Modal,
    ModalDialog,
    DialogContent,
    DialogTitle,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Alert,
    FormHelperText,
    Box,
    LinearProgress,
    Typography,
} from "@mui/joy";
import { submitReport } from "@/actions/reportAction";
import { ReportFormState } from "@/lib/serverActionTypes";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SendReportProps {
    open: boolean;
    onClose: () => void;
}

const INITIAL_STATE: ReportFormState = {
    submitState: "not_sent",
    data: {
        title: "",
        description: "",
    },
};

const SendReport: FC<SendReportProps> = ({ open, onClose }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formState, formAction, isPending] = useActionState(
        submitReport,
        INITIAL_STATE
    );

    const [selectedFileName, setSelectedFileName] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFileName(e.target.files[0].name);
        } else {
            setSelectedFileName("");
        }
    };

    const handleClose = () => {
        if (!isPending) {
            if (formRef.current) {
                formRef.current.reset();
            }
            setSelectedFileName("");
            onClose();
        }
    };

    return (
        <Modal keepMounted={false} open={open} onClose={handleClose}>
            <ModalDialog
                layout="center"
                variant="plain"
                sx={{
                    width: "40rem",
                    maxWidth: "90vw",
                }}
            >
                <DialogTitle
                    sx={{
                        marginBottom: 2,
                    }}
                >
                    Reportar un problema
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {isPending && <LinearProgress />}

                    <form
                        ref={formRef}
                        action={formAction}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        {/* Title Field */}
                        <FormControl
                            error={Boolean(formState.fieldErrors?.title)}
                            required
                        >
                            <FormLabel>Título</FormLabel>
                            <Input
                                name="title"
                                type="text"
                                placeholder="Breve descripción del problema"
                                disabled={isPending}
                                defaultValue={formState.data?.title ?? ""}
                                slotProps={{
                                    input: {
                                        maxLength: 100,
                                    },
                                }}
                            />
                            {formState.fieldErrors?.title && (
                                <FormHelperText>
                                    <ErrorIcon
                                        sx={{
                                            fontSize: "1rem",
                                            marginRight: "0.5rem",
                                        }}
                                    />
                                    {formState.fieldErrors.title[0]}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Description Field */}
                        <FormControl
                            error={Boolean(formState.fieldErrors?.description)}
                            required
                        >
                            <FormLabel>Descripción</FormLabel>
                            <Textarea
                                name="description"
                                placeholder="Proporciona detalles sobre el problema que encontraste"
                                minRows={4}
                                maxRows={8}
                                disabled={isPending}
                                defaultValue={formState.data?.description ?? ""}
                                slotProps={{
                                    textarea: {
                                        maxLength: 1000,
                                    },
                                }}
                            />
                            {formState.fieldErrors?.description && (
                                <FormHelperText>
                                    <ErrorIcon
                                        sx={{
                                            fontSize: "1rem",
                                            marginRight: "0.5rem",
                                        }}
                                    />
                                    {formState.fieldErrors.description[0]}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Media Field */}
                        <FormControl
                            error={Boolean(formState.fieldErrors?.media)}
                        >
                            <FormLabel>
                                Captura de pantalla o video (opcional)
                            </FormLabel>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    padding: "0.75rem",
                                    borderRadius: "md",
                                    border: "1px solid",
                                    borderColor: formState.fieldErrors?.media
                                        ? "danger.outlinedBorder"
                                        : "neutral.outlinedBorder",
                                    backgroundColor: "neutral.softBg",
                                    cursor: isPending
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                                onClick={() =>
                                    !isPending && fileInputRef.current?.click()
                                }
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="media"
                                    accept="image/png,image/jpeg,image/jpg,video/mp4,video/quicktime,video/x-msvideo"
                                    onChange={handleFileChange}
                                    disabled={isPending}
                                    style={{ display: "none" }}
                                />
                                <Typography
                                    level="body-sm"
                                    sx={{
                                        flex: 1,
                                        color: selectedFileName
                                            ? "success.main"
                                            : "neutral.main",
                                    }}
                                >
                                    {selectedFileName ||
                                        "Haz clic para seleccionar un archivo"}
                                </Typography>
                            </Box>
                            <FormHelperText
                                sx={{
                                    fontSize: "0.75rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                PNG, JPG, JPEG, MP4, MOV, AVI (máx. 100MB)
                            </FormHelperText>
                            {formState.fieldErrors?.media && (
                                <FormHelperText
                                    sx={{
                                        color: "danger.main",
                                    }}
                                >
                                    <ErrorIcon
                                        sx={{
                                            fontSize: "1rem",
                                            marginRight: "0.5rem",
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    {formState.fieldErrors.media[0]}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* Error Alert */}
                        {formState.submitState === "error" &&
                            !formState.fieldErrors && (
                                <Alert
                                    color="danger"
                                    startDecorator={<ErrorIcon />}
                                    sx={{ marginTop: "0.5rem" }}
                                >
                                    {formState.message ||
                                        "Error al enviar el reporte"}
                                </Alert>
                            )}

                        {/* Success Alert */}
                        {formState.submitState === "success" && (
                            <Alert
                                color="success"
                                startDecorator={<CheckCircleIcon />}
                                sx={{ marginTop: "0.5rem" }}
                            >
                                {formState.message ||
                                    "¡Reporte enviado exitosamente!"}
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                marginTop: 2,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={handleClose}
                                disabled={isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                loading={isPending}
                                disabled={isPending}
                            >
                                Enviar reporte
                            </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
};

export default SendReport;
