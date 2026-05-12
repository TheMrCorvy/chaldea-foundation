import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

import { getSessionToken } from "./auth.js";
import type {
    DeleteFileOptions,
    DownloadFileOptions,
    MediafireConfig,
    UploadFileOptions,
} from "./types.js";

const BASE_URL = "https://www.mediafire.com/api/1.5";

export class MediafireStorage {
    constructor(private config: MediafireConfig) {}

    private async getToken() {
        return getSessionToken(this.config);
    }

    async uploadFile(options: UploadFileOptions) {
        const token = await this.getToken();

        const formData = new FormData();

        formData.append("session_token", token);
        formData.append("response_format", "json");

        if (options.remoteFolderKey) {
            formData.append("folder_key", options.remoteFolderKey);
        }

        const fileBuffer = await fs.promises.readFile(options.localPath);

        const blob = new Blob([fileBuffer]);

        formData.append("file", blob, path.basename(options.localPath));

        const response = await fetch(`${BASE_URL}/upload/simple.php`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload file");
        }

        return response.json();
    }

    async deleteFile(options: DeleteFileOptions) {
        const token = await this.getToken();

        const params = new URLSearchParams({
            session_token: token,
            quick_key: options.quickKey,
            response_format: "json",
        });

        const response = await fetch(`${BASE_URL}/file/delete.php?${params}`);

        if (!response.ok) {
            throw new Error("Failed to delete file");
        }

        return response.json();
    }

    async downloadFile(options: DownloadFileOptions) {
        const response = await fetch(
            `https://download${options.quickKey}.mediafire.com/${options.quickKey}`
        );

        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        const arrayBuffer = await response.arrayBuffer();

        await fs.promises.writeFile(
            options.outputPath,
            Buffer.from(arrayBuffer)
        );
    }
}
