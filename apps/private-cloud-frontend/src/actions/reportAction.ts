"use server";

import { ReportFormState } from "@/lib/serverActionTypes";
import { CookiesList, getCookie, JwtCookie } from "@/utils/cookies";
import uploadToPS from "@/utils/uploadToPS";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";

const TITLE_MIN_LENGTH = 5;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 1000;
const ALLOWED_MEDIA_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function submitReport(
    prevState: ReportFormState,
    formData: FormData
): Promise<ReportFormState> {
    const title = formData.get("title");
    const description = formData.get("description");
    const mediaFile = formData.get("media") as File | null;

    const fieldErrors: ReportFormState["fieldErrors"] = {};

    if (!title || typeof title !== "string" || title.trim().length === 0) {
        fieldErrors.title = ["El título es requerido"];
    } else if (title.length < TITLE_MIN_LENGTH) {
        fieldErrors.title = [
            `El título debe tener al menos ${TITLE_MIN_LENGTH} caracteres`,
        ];
    } else if (title.length > TITLE_MAX_LENGTH) {
        fieldErrors.title = [
            `El título no puede exceder ${TITLE_MAX_LENGTH} caracteres`,
        ];
    }

    if (
        !description ||
        typeof description !== "string" ||
        description.trim().length === 0
    ) {
        fieldErrors.description = ["La descripción es requerida"];
    } else if (description.length < DESCRIPTION_MIN_LENGTH) {
        fieldErrors.description = [
            `La descripción debe tener al menos ${DESCRIPTION_MIN_LENGTH} caracteres`,
        ];
    } else if (description.length > DESCRIPTION_MAX_LENGTH) {
        fieldErrors.description = [
            `La descripción no puede exceder ${DESCRIPTION_MAX_LENGTH} caracteres`,
        ];
    }

    if (mediaFile && mediaFile.size > 0) {
        if (mediaFile.size > MAX_FILE_SIZE) {
            fieldErrors.media = ["El archivo no puede exceder 100MB"];
        } else if (!ALLOWED_MEDIA_TYPES.includes(mediaFile.type)) {
            fieldErrors.media = [
                "El archivo debe ser una imagen (PNG, JPG, JPEG) o video (MP4, MOV, AVI)",
            ];
        }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return {
            ...prevState,
            submitState: "error",
            message: "Por favor, corrija los errores en el formulario",
            fieldErrors,
            data: {
                title: typeof title === "string" ? title : "",
                description: typeof description === "string" ? description : "",
            },
        };
    }

    const platformService = new PlatformService();

    try {
        const reportData: {
            title: string;
            description: string;
            publishedAt: string;
            media?: Array<{ id: string }>;
        } = {
            title: String(title),
            description: String(description),
            publishedAt: new Date().toISOString(),
        };

        if (mediaFile && mediaFile.size > 0) {
            const jwtCookie = (await getCookie(
                CookiesList.JWT
            )) as JwtCookie | null;

            if (!jwtCookie) {
                fieldErrors.media = [
                    "Se requiere iniciar sesión para subir archivos",
                ];
                return {
                    ...prevState,
                    submitState: "error",
                    message:
                        "Error de autenticación. Por favor, intente nuevamente",
                    fieldErrors,
                    data: {
                        title: typeof title === "string" ? title : "",
                        description:
                            typeof description === "string" ? description : "",
                    },
                };
            }

            const mediaIds = await uploadToPS(mediaFile, jwtCookie.jwt);

            if (!mediaIds) {
                return {
                    ...prevState,
                    submitState: "error",
                    message:
                        "Error al subir el archivo. Por favor, intente nuevamente",
                    fieldErrors: {
                        media: ["Error al subir el archivo"],
                    },
                    data: {
                        title: typeof title === "string" ? title : "",
                        description:
                            typeof description === "string" ? description : "",
                    },
                };
            }

            reportData.media = mediaIds.map((id) => ({ id }));
        }

        const jwtCookie = (await getCookie(
            CookiesList.JWT
        )) as JwtCookie | null;

        if (!jwtCookie) {
            logData({
                title: "Unauthorized upload attempt",
                layer: "bug_report",
                data: { reason: "No JWT token" },
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                ...prevState,
                submitState: "error",
                message: "No puedes enviar reportes sin haber iniciado sesión.",
                fieldErrors: {
                    description: [
                        "No puedes enviar reportes sin haber iniciado sesión.",
                    ],
                },
                data: {
                    title: typeof title === "string" ? title : "",
                    description:
                        typeof description === "string" ? description : "",
                },
            };
        }

        platformService.setJWT(jwtCookie.jwt);

        const { data, error } = await platformService.call(
            "bReportPostBReports",
            {
                body: {
                    data: reportData,
                },
            }
        );

        if (error) {
            logData({
                title: "Error creating report",
                layer: "bug_report",
                data: error,
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                ...prevState,
                submitState: "error",
                message:
                    "Error al crear el reporte. Por favor, intente nuevamente",
                data: {
                    title: typeof title === "string" ? title : "",
                    description:
                        typeof description === "string" ? description : "",
                },
            };
        }

        if (!data || !data.data) {
            logData({
                title: "Error connecting with backend",
                layer: "bug_report",
                data,
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                ...prevState,
                submitState: "error",
                message: "No se recibieron datos del servidor",
                data: {
                    title: typeof title === "string" ? title : "",
                    description:
                        typeof description === "string" ? description : "",
                },
            };
        }

        logData({
            title: "Report created successfully",
            layer: "bug_report",
            data: {
                reportId: data.data.documentId,
            },
            type: "info",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return {
            submitState: "success",
            message:
                "¡Reporte enviado exitosamente! Gracias por tu retroalimentación.",
        };
    } catch (error) {
        logData({
            title: "Unexpected error submitting report",
            layer: "bug_report",
            data: error,
            type: "error",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return {
            ...prevState,
            submitState: "error",
            message:
                "Ocurrió un error inesperado. Por favor, intente nuevamente",
            data: {
                title: typeof title === "string" ? title : "",
                description: typeof description === "string" ? description : "",
            },
        };
    }
}
