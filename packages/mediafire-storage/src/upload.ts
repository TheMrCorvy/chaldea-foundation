import fs from "fs";
import path from "path";

import type { UploadFileOptions } from "./types.js";

import { MEDIAFIRE_API_BASE, parseJsonResponse, sleep } from "./utils.js";

interface UploadResponse {
    response: {
        doupload: {
            key: string;
        };
    };
}

interface PollUploadResponse {
    response: {
        doupload: {
            status: number;
            quickkey?: string;
            result?: string;
        };
    };
}

export async function uploadFile(
    sessionToken: string,
    options: UploadFileOptions
) {
    const formData = new FormData();

    formData.append("session_token", sessionToken);
    formData.append("response_format", "json");

    if (options.remoteFolderKey) {
        formData.append("folder_key", options.remoteFolderKey);
    }

    const fileBuffer = await fs.promises.readFile(options.localPath);

    const blob = new Blob([fileBuffer]);

    formData.append("file", blob, path.basename(options.localPath));

    const uploadResponse = await fetch(
        `${MEDIAFIRE_API_BASE}/upload/simple.php`,
        {
            method: "POST",
            body: formData,
        }
    );

    const uploadData = await parseJsonResponse<UploadResponse>(uploadResponse);

    const uploadKey = uploadData.response.doupload.key;

    if (!uploadKey) {
        throw new Error("MediaFire upload failed: missing upload key");
    }

    return pollUpload(sessionToken, uploadKey);
}

async function pollUpload(sessionToken: string, uploadKey: string) {
    for (let attempt = 0; attempt < 30; attempt++) {
        const params = new URLSearchParams({
            session_token: sessionToken,
            key: uploadKey,
            response_format: "json",
        });

        const response = await fetch(
            `${MEDIAFIRE_API_BASE}/upload/poll_upload.php?${params}`
        );

        const data = await parseJsonResponse<PollUploadResponse>(response);

        const upload = data.response.doupload;

        /**
         * status === 99 means upload completed
         */
        if (upload.status === 99 && upload.quickkey) {
            return {
                quickKey: upload.quickkey,
            };
        }

        await sleep(1000);
    }

    throw new Error("Timed out while polling MediaFire upload");
}
