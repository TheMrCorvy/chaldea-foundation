import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
import type { RemoteStorageAdapter } from "../../adapter";
import type {
    DeleteInput,
    DeleteResult,
    DownloadInput,
    DownloadResult,
    OverwriteInput,
    OverwriteResult,
    UploadInput,
    UploadResult,
} from "../../types";
import type { GoogleDriveConfig } from "./google-drive.config";
import { deleteService } from "./services/deleteService";
import { downloadService } from "./services/downloadService";
import { overwriteService } from "./services/overwriteService";
import { uploadService } from "./services/uploadService";

export class GoogleDriveAdapter implements RemoteStorageAdapter {
    private readonly drive: drive_v3.Drive;

    constructor(private readonly config: GoogleDriveConfig) {
        const auth = new google.auth.OAuth2(
            config.clientId,
            config.clientSecret,
            config.redirectUri
        );

        auth.setCredentials({ refresh_token: config.refreshToken });

        this.drive = google.drive({ version: "v3", auth });
    }

    async upload(input: UploadInput): Promise<UploadResult> {
        return uploadService(this.drive, input, this.config.defaultFolderId);
    }

    async download(input: DownloadInput): Promise<DownloadResult> {
        return downloadService(this.drive, input);
    }

    async overwrite(input: OverwriteInput): Promise<OverwriteResult> {
        return overwriteService(this.drive, input);
    }

    async delete(input: DeleteInput): Promise<DeleteResult> {
        return deleteService(this.drive, input);
    }
}
