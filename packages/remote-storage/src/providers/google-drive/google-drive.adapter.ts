import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { pipeline } from "node:stream/promises";
import type { Readable } from "node:stream";
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

function toStringRecord(
    record: Record<string, unknown>
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(record).map(([k, v]) => [k, String(v)])
    );
}

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
        const fileName = input.fileName ?? path.basename(input.localPath);
        const stats = fs.statSync(input.localPath);

        const requestBody: drive_v3.Schema$File = {
            name: fileName,
            ...(this.config.defaultFolderId
                ? { parents: [this.config.defaultFolderId] }
                : {}),
            ...(input.metadata
                ? { appProperties: toStringRecord(input.metadata) }
                : {}),
        };

        const response = await this.drive.files.create({
            requestBody,
            media: {
                mimeType: input.mimeType ?? "application/octet-stream",
                body: fs.createReadStream(input.localPath),
            },
            fields: "id,name,md5Checksum",
        });

        const { id, md5Checksum } = response.data;

        if (!id) {
            throw new Error(
                "Google Drive did not return a file ID after upload."
            );
        }

        return {
            file: {
                id,
                provider: "google-drive",
                metadata: { name: fileName },
            },
            sizeBytes: stats.size,
            checksum: md5Checksum ?? undefined,
        };
    }

    async download(input: DownloadInput): Promise<DownloadResult> {
        const targetPath =
            input.targetPath ?? path.join(os.tmpdir(), input.file.id);

        const response = await this.drive.files.get(
            { fileId: input.file.id, alt: "media" },
            { responseType: "stream" }
        );

        await pipeline(
            response.data as unknown as Readable,
            fs.createWriteStream(targetPath)
        );

        return { localPath: targetPath };
    }

    async overwrite(input: OverwriteInput): Promise<OverwriteResult> {
        const requestBody: drive_v3.Schema$File = input.metadata
            ? { appProperties: toStringRecord(input.metadata) }
            : {};

        const response = await this.drive.files.update({
            fileId: input.file.id,
            requestBody,
            media: {
                mimeType: input.mimeType ?? "application/octet-stream",
                body: fs.createReadStream(input.localPath),
            },
            fields: "id,modifiedTime",
        });

        const { id, modifiedTime } = response.data;

        if (!id) {
            throw new Error(
                "Google Drive did not return a file ID after overwrite."
            );
        }

        return {
            file: {
                id,
                provider: "google-drive",
                metadata: input.file.metadata,
            },
            updatedAt: modifiedTime ?? undefined,
        };
    }

    async delete(input: DeleteInput): Promise<DeleteResult> {
        await this.drive.files.delete({ fileId: input.file.id });

        return {
            deleted: true,
            fileId: input.file.id,
        };
    }
}
