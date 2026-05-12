import { getSessionToken } from "./auth.js";

import { uploadFile } from "./upload.js";
import { downloadFile } from "./download.js";
import { deleteFile } from "./delete.js";

import type {
    DeleteFileOptions,
    DownloadFileOptions,
    MediafireConfig,
    UploadFileOptions,
} from "./types.js";

export class MediafireStorage {
    private sessionToken?: string;

    constructor(private config: MediafireConfig) {}

    private async getToken() {
        if (this.sessionToken) {
            return this.sessionToken;
        }

        this.sessionToken = await getSessionToken(this.config);

        return this.sessionToken;
    }

    async uploadFile(options: UploadFileOptions) {
        const token = await this.getToken();

        return uploadFile(token, options);
    }

    async downloadFile(options: DownloadFileOptions) {
        const token = await this.getToken();

        return downloadFile(token, options);
    }

    async deleteFile(options: DeleteFileOptions) {
        const token = await this.getToken();

        return deleteFile(token, options);
    }
}
