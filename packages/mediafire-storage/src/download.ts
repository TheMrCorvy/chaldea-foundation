import fs from "fs";

import type { DownloadFileOptions } from "./types.js";

import { MEDIAFIRE_API_BASE, parseJsonResponse } from "./utils.js";

interface GetLinksResponse {
    response: {
        links: Array<{
            normal_download: string;
            direct_download: string;
        }>;
    };
}

export async function downloadFile(
    sessionToken: string,
    options: DownloadFileOptions
) {
    const params = new URLSearchParams({
        session_token: sessionToken,
        quick_key: options.quickKey,
        response_format: "json",
    });

    const linksResponse = await fetch(
        `${MEDIAFIRE_API_BASE}/file/get_links.php?${params}`
    );

    const linksData = await parseJsonResponse<GetLinksResponse>(linksResponse);

    const directDownloadUrl = linksData.response.links?.[0]?.direct_download;

    if (!directDownloadUrl) {
        throw new Error("Unable to resolve MediaFire download URL");
    }

    const fileResponse = await fetch(directDownloadUrl);

    if (!fileResponse.ok) {
        throw new Error("Failed downloading file from MediaFire");
    }

    if (!fileResponse.body) {
        throw new Error("Download response body is empty");
    }

    const fileStream = fs.createWriteStream(options.outputPath);

    await new Promise<void>(async (resolve, reject) => {
        const reader = fileResponse.body!.getReader();

        async function pump() {
            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        fileStream.end();
                        resolve();
                        break;
                    }

                    fileStream.write(value);
                }
            } catch (error) {
                reject(error);
            }
        }

        pump();
    });

    return {
        outputPath: options.outputPath,
    };
}
