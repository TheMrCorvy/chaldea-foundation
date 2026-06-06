import { NextRequest, NextResponse } from "next/server";
import { CookiesList, getCookie, JwtCookie } from "@/utils/cookies";
import { logData } from "@repo/shared-utils/log-data";
import { NasService } from "@/services/nasService";
import { isValidFilePath, sanitizeFilePath } from "@/utils/filePathValidator";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Range, Content-Type",
            "Access-Control-Max-Age": "86400",
        },
    });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    logData({
        data: {
            episodeId: resolvedParams.id,
        },
        layer: "video_streaming",
        title: "/stream-episode/[id]",
    });

    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie | null;

    if (!jwt || !jwt.jwt) {
        return NextResponse.json(
            {
                message: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }

    const filePath = request.nextUrl.searchParams.get("filePath");

    if (!filePath) {
        return NextResponse.json(
            {
                message: "Missing filePath query parameter",
            },
            {
                status: 400,
            }
        );
    }

    if (!isValidFilePath(filePath)) {
        logData({
            data: {
                episodeId: resolvedParams.id,
                invalidPath: filePath,
            },
            layer: "video_streaming",
            title: "Invalid file path attempt",
        });

        return NextResponse.json(
            {
                message: "Invalid file path",
            },
            {
                status: 400,
            }
        );
    }

    const sanitizedPath = sanitizeFilePath(filePath);
    const nasApiKey = process.env.NAS_API_KEY;

    if (!nasApiKey) {
        logData({
            title: "NAS API key is not configured",
            layer: "*",
            type: "error",
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        return NextResponse.json(
            {
                message: "Server configuration error",
            },
            {
                status: 500,
            }
        );
    }

    try {
        const nasService = NasService();
        const response = await nasService.serveEpisode({
            filePath: sanitizedPath,
            range: request.headers.get("range"),
            apiKey: nasApiKey,
        });

        if ("error" in response || !("stream" in response)) {
            return NextResponse.json(
                {
                    message: response.message,
                    error: "error" in response ? response.error : undefined,
                },
                {
                    status: response.status,
                }
            );
        }

        return new NextResponse(response.stream, {
            status: response.status,
            headers: {
                ...response.headers,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Range",
            },
        });
    } catch (error) {
        logData({
            title: "Error in stream-episode route",
            data: error,
            type: "error",
            layer: "*",
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        return NextResponse.json(
            {
                message: "Internal server error",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}
