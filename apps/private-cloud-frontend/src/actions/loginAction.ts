"use server";

import { AuthFormState } from "@/lib/serverActionTypes";
import { CookiesList, setCookie } from "@/utils/cookies";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";

export async function performLogin(
    prevState: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    const platformService = new PlatformService();
    platformService.clearJWT();

    try {
        const { data, error } = await platformService.call(
            "usersPermissionsPostAuthLocal",
            {
                body: {
                    identifier: String(identifier),
                    password: String(password),
                },
            }
        );

        if (error) {
            logData({
                title: "Invalid credentials provided",
                layer: "auth_login",
                data: error,
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                submitState: "error",
                message: "Credenciales inválidas",
                data: {
                    identifier: String(identifier),
                    password: String(password),
                },
            };
        }

        if (!data) {
            logData({
                title: "Error connecting with backend",
                layer: "auth_login",
                data,
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                ...prevState,
                submitState: "error",
                message: "No se recibieron datos del servidor.",
            };
        }

        await setCookie({
            name: CookiesList.JWT,
            value: data.jwt,
        });

        platformService.setJWT(data.jwt);

        const me = await platformService.call("usersPermissionsGetUsersMe", {
            query: {
                populate: "role",
            },
        });

        await setCookie({
            name: CookiesList.USER,
            value: me.data,
        });

        logData({
            title: "Login successful",
            layer: "auth_login",
            data: {
                me: me.data,
                data,
            },
            type: "info",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return {
            ...prevState,
            submitState: "success",
            message: "Inicio de sesión exitoso. Redirigiendo...",
        };
    } catch (err) {
        logData({
            title: "Error connecting with backend",
            layer: "*",
            data: err,
            type: "error",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return {
            ...prevState,
            submitState: "error",
            message: "Error al conectar con el servidor",
        };
    }
}
