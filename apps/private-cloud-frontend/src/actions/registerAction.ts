"use server";

import { AuthFormState } from "@/lib/serverActionTypes";
import { CookiesList, setCookie } from "@/utils/cookies";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";

export async function performRegister(
    prevState: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const registerToken = formData.get("register_token");
    const platformService = new PlatformService();

    try {
        const { data, error } = await platformService.call(
            "usersPermissionsPostAuthLocalRegister",
            {
                body: {
                    email: String(email),
                    username: String(username),
                    password: String(password),
                },
            }
        );

        if (error) {
            logData({
                title: "Invalid credentials provided",
                layer: "auth_register",
                data: error,
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                submitState: "error",
                message: "Credenciales inválidas o usuario ya existe",
                data: {
                    email: String(email),
                    username: String(username),
                    password: String(password),
                },
            };
        }

        if (!data) {
            logData({
                title: "Error connecting with backend",
                layer: "auth_register",
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

        logData({
            title: "Register success",
            layer: "auth_register",
            data: {
                identifier: data.user?.email || data.user?.username,
                email: data.user?.email,
                data,
            },
            type: "info",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

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

        platformService.clearJWT();
        platformService.setJWT(process.env.STRAPI_REGISTER_TOKEN_API_KEY || "");

        const remoteToken = await platformService.call(
            "bRegisterTokenGetBRegisterTokens",
            {
                query: {
                    filters: {
                        token: {
                            $eq: String(registerToken),
                        },
                        used: {
                            $eq: false,
                        },
                    },
                },
            }
        );

        if (
            !remoteToken ||
            !remoteToken.data ||
            !remoteToken.data.data ||
            !remoteToken.data.data[0]
        ) {
            throw new Error(
                "Something went wrong when deleting the register token."
            );
        }

        await platformService.call("bRegisterTokenPutBRegisterTokensById", {
            body: {
                data: {
                    used: true,
                },
            },
            path: {
                id: remoteToken.data.data[0].documentId,
            },
        });

        return {
            ...prevState,
            submitState: "success",
            message: "Registro exitoso. Redirigiendo...",
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
