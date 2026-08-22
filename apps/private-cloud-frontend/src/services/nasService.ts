import { logData } from "@repo/shared-utils/log-data";

interface ServeEpisodeParams {
    filePath: string;
    range: string | null;
    apiKey: string;
}

interface StreamResponse {
    status: number;
    headers: Record<string, string>;
    stream: ReadableStream<Uint8Array>;
}

interface ErrorResponse {
    status: number;
    message: string;
    error?: string;
}

export type ServeEpisodeResponse = StreamResponse | ErrorResponse;

export function NasService() {
    const nasBaseUrl = process.env.NAS_BASE_URL;

    if (!nasBaseUrl) {
        throw new Error(
            "NAS_BASE_URL is not configured in environment variables"
        );
    }

    async function serveEpisode({
        filePath,
        range,
        apiKey,
    }: ServeEpisodeParams): Promise<ServeEpisodeResponse> {
        try {
            const url = new URL("/api/serve-episode", nasBaseUrl);
            url.searchParams.append("filePath", filePath);
            url.searchParams.append("apiKey", apiKey);

            const headers: HeadersInit = {
                Accept: "video/*",
            };

            if (range) {
                headers["Range"] = range;
            }

            const response = await fetch(url.toString(), {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: "Unknown error from NAS",
                }));

                return {
                    status: response.status,
                    message: errorData.message || "Error from NAS service",
                    error: errorData.error,
                };
            }

            const responseHeaders: Record<string, string> = {};

            const headersToProxy = [
                "content-type",
                "content-length",
                "content-range",
                "accept-ranges",
                "cache-control",
            ];

            headersToProxy.forEach((headerName) => {
                const value = response.headers.get(headerName);
                if (value) {
                    responseHeaders[headerName] = value;
                }
            });

            const stream = response.body;

            if (!stream) {
                return {
                    status: 500,
                    message: "No stream received from NAS",
                };
            }

            return {
                status: response.status,
                headers: responseHeaders,
                stream,
            };
        } catch (error) {
            logData({
                title: "Error in NasService.serveEpisode",
                data: { error },
                layer: "*",
                type: "error",
            });
            return {
                status: 500,
                message: "Failed to connect to NAS service",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    return {
        serveEpisode,
    };
}
