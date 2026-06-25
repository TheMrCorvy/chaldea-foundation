"use client";

import { FC, useActionState, useState } from "react";
import {
    Box,
    Input,
    Button,
    FormControl,
    FormLabel,
    Stack,
    Alert,
    LinearProgress,
    Typography,
    IconButton,
} from "@mui/joy";
import useStyles from "./useStyles";
import { performLogin } from "@/actions/loginAction";
import { AuthFormState } from "@/lib/serverActionTypes";
import { performRegister } from "@/actions/registerAction";
import { redirect } from "next/navigation";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { WebRoutes } from "@/utils/routes";

export interface TicketFormProps {
    isRegisterForm: boolean;
    registerToken?: string;
}

const INITIAL_STATE: AuthFormState = {
    submitState: "not_sent",
    message: undefined,
    data: {
        password: "",
    },
};

const TicketForm: FC<TicketFormProps> = ({ isRegisterForm, registerToken }) => {
    const { root, form, fullWidth, button, inputTextColor } = useStyles();
    const definitiveFormAction = isRegisterForm
        ? performRegister
        : performLogin;

    const [formState, formAction] = useActionState(
        definitiveFormAction,
        INITIAL_STATE
    );

    const [passwordValue, setPasswordValue] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (formState.submitState === "success" && isRegisterForm) {
        redirect(WebRoutes.PENDING_USER_ACTIVATION);
    }
    if (formState.submitState === "success" && !isRegisterForm) {
        redirect(WebRoutes.HOME);
    }

    const minLength = 12;

    return (
        <Box
            role="form"
            component="section"
            aria-label={
                isRegisterForm
                    ? "Formulario de registro"
                    : "Formulario de inicio de sesión"
            }
            sx={root}
        >
            <Stack component="form" action={formAction} spacing={3} sx={form}>
                {isRegisterForm ? (
                    <>
                        <FormControl required sx={fullWidth}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                sx={inputTextColor}
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                autoComplete="email"
                                required
                                defaultValue={formState.data?.email ?? ""}
                            />
                        </FormControl>
                        <FormControl required sx={fullWidth}>
                            <FormLabel>Nombre de Usuario</FormLabel>
                            <Input
                                sx={inputTextColor}
                                name="username"
                                type="text"
                                placeholder="jorge_nitales"
                                autoComplete="username"
                                required
                                defaultValue={formState.data?.username ?? ""}
                            />
                        </FormControl>
                    </>
                ) : (
                    <FormControl required sx={fullWidth}>
                        <FormLabel>Nombre de Usuario o Email</FormLabel>
                        <Input
                            sx={inputTextColor}
                            name="identifier"
                            type="text"
                            placeholder="jorge_nitales"
                            autoComplete="username"
                            required
                            defaultValue={formState.data?.identifier ?? ""}
                        />
                    </FormControl>
                )}
                {isRegisterForm ? (
                    <Stack
                        spacing={1}
                        sx={{
                            "--hue": Math.min(passwordValue.length * 10, 120),
                        }}
                    >
                        <input
                            type="hidden"
                            name="register_token"
                            value={registerToken}
                        />
                        <FormControl required sx={fullWidth}>
                            <FormLabel>Contraseña</FormLabel>
                            <Input
                                sx={inputTextColor}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Type in here…"
                                startDecorator={
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOffIcon />
                                        ) : (
                                            <VisibilityIcon />
                                        )}
                                    </IconButton>
                                }
                                value={passwordValue}
                                onChange={(e) =>
                                    setPasswordValue(e.target.value)
                                }
                                required
                            />
                        </FormControl>
                        <LinearProgress
                            determinate
                            size="sm"
                            value={Math.min(
                                (passwordValue.length * 100) / minLength,
                                100
                            )}
                            sx={{
                                bgcolor: "background.level3",
                                color: "hsl(var(--hue) 80% 40%)",
                            }}
                        />
                        <Typography
                            level="body-xs"
                            sx={{
                                alignSelf: "flex-end",
                                color: "hsl(var(--hue) 80% 30%)",
                            }}
                        >
                            {passwordValue.length < 3 && "Muy débil."}
                            {passwordValue.length >= 3 &&
                                passwordValue.length < 6 &&
                                "Débil"}
                            {passwordValue.length >= 6 &&
                                passwordValue.length < 10 &&
                                "Fuerte"}
                            {passwordValue.length >= 10 && "Muy fuerte"}
                        </Typography>
                    </Stack>
                ) : (
                    <FormControl required sx={fullWidth}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            sx={inputTextColor}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            defaultValue={formState.data?.password ?? ""}
                            startDecorator={
                                <IconButton
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <VisibilityIcon />
                                    ) : (
                                        <VisibilityOffIcon />
                                    )}
                                </IconButton>
                            }
                        />
                    </FormControl>
                )}

                {formState.message && (
                    <Alert color="warning" variant="outlined" size="sm">
                        {formState.message}
                    </Alert>
                )}
                <Button type="submit" size="lg" sx={button}>
                    {isRegisterForm ? "Registrarse" : "Ingresar"}
                </Button>
            </Stack>
        </Box>
    );
};

export default TicketForm;
