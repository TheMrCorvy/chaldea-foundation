import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { google } from "googleapis";
import type { drive_v3 } from "googleapis";
import type { RemoteStorageAdapter } from "../../adapter";
import {
    RemoteStorageProvider,
    type DeleteInput,
    type DeleteResult,
    type DownloadInput,
    type DownloadResult,
    type OverwriteInput,
    type OverwriteResult,
    type UploadInput,
    type UploadResult,
} from "../../types";
import type { GoogleDriveConfig } from "./google-drive.config";

function toStringRecord(
    record: Record<string, unknown>
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(record).map(([key, value]) => [key, String(value)])
    );
}

function escapeDriveQueryValue(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
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

    private async getOrCreateFolder(
        folderName: string,
        parentId?: string
    ): Promise<string> {
        const escapedName = escapeDriveQueryValue(folderName);

        let query =
            "mimeType = 'application/vnd.google-apps.folder'" +
            ` and name = '${escapedName}'` +
            " and trashed = false";

        if (parentId) {
            query += ` and '${escapeDriveQueryValue(parentId)}' in parents`;
        }

        const found = await this.drive.files.list({
            q: query,
            fields: "files(id)",
            pageSize: 1,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        const files = found.data.files;
        if (files && files.length > 0) {
            const firstFile = files[0];
            let existingFolderId: string | undefined;

            if (firstFile) {
                existingFolderId = firstFile.id ?? undefined;
            }

            if (existingFolderId) {
                return existingFolderId;
            }
        }

        const requestBody: drive_v3.Schema$File = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
        };

        if (parentId) {
            requestBody.parents = [parentId];
        }

        const created = await this.drive.files.create({
            requestBody,
            fields: "id",
            supportsAllDrives: true,
        });

        const folderId = created.data.id;
        if (!folderId) {
            throw new Error(
                `Google Drive did not return a folder ID for "${folderName}".`
            );
        }

        return folderId;
    }

    private async resolveDestination(destinationPath: string): Promise<{
        parentId?: string;
        fileNameFromPath?: string;
    }> {
        const rawPath = destinationPath.trim();
        const hasTrailingSlash = /[\\/]$/.test(rawPath);

        const normalizedPath = path.posix
            .normalize(rawPath.replace(/\\/g, "/"))
            .replace(/^\/+/, "");

        const segments = normalizedPath
            .split("/")
            .map((segment) => segment.trim())
            .filter((segment) => segment.length > 0 && segment !== ".");

        let parentId = this.config.defaultFolderId;
        let fileNameFromPath: string | undefined;

        if (segments.length === 0) {
            return { parentId, fileNameFromPath };
        }

        const folderSegments = [...segments];

        if (!hasTrailingSlash) {
            const maybeFileName = folderSegments.pop();
            if (maybeFileName) {
                fileNameFromPath = maybeFileName;
            }
        }

        for (const folderName of folderSegments) {
            parentId = await this.getOrCreateFolder(folderName, parentId);
        }

        return { parentId, fileNameFromPath };
    }

    async upload(input: UploadInput): Promise<UploadResult> {
        const destination = await this.resolveDestination(
            input.destinationPath
        );

        let fileName = path.basename(input.localPath);
        if (destination.fileNameFromPath) {
            fileName = destination.fileNameFromPath;
        }
        if (input.fileName) {
            fileName = input.fileName;
        }

        const requestBody: drive_v3.Schema$File = { name: fileName };

        if (destination.parentId) {
            requestBody.parents = [destination.parentId];
        }

        if (input.metadata) {
            requestBody.appProperties = toStringRecord(input.metadata);
        }

        let mimeType = "application/octet-stream";
        if (input.mimeType) {
            mimeType = input.mimeType;
        }

        const stats = fs.statSync(input.localPath);

        const response = await this.drive.files.create({
            requestBody,
            media: {
                mimeType,
                body: fs.createReadStream(input.localPath),
            },
            fields: "id,md5Checksum",
            supportsAllDrives: true,
        });

        const fileId = response.data.id;
        if (!fileId) {
            throw new Error(
                "Google Drive did not return a file ID after upload."
            );
        }

        const result: UploadResult = {
            file: {
                id: fileId,
                provider: RemoteStorageProvider.GoogleDrive,
                metadata: { name: fileName },
            },
            sizeBytes: stats.size,
        };

        const checksum = response.data.md5Checksum;
        if (checksum) {
            result.checksum = checksum;
        }

        return result;
    }

    async download(input: DownloadInput): Promise<DownloadResult> {
        let targetPath = path.join(os.tmpdir(), input.file.id);
        if (input.targetPath) {
            targetPath = input.targetPath;
        }

        const response = await this.drive.files.get(
            {
                fileId: input.file.id,
                alt: "media",
                supportsAllDrives: true,
            },
            { responseType: "stream" }
        );

        await pipeline(
            response.data as unknown as Readable,
            fs.createWriteStream(targetPath)
        );

        return { localPath: targetPath };
    }

    async overwrite(input: OverwriteInput): Promise<OverwriteResult> {
        const requestBody: drive_v3.Schema$File = {};

        if (input.metadata) {
            requestBody.appProperties = toStringRecord(input.metadata);
        }

        let mimeType = "application/octet-stream";
        if (input.mimeType) {
            mimeType = input.mimeType;
        }

        const response = await this.drive.files.update({
            fileId: input.file.id,
            requestBody,
            media: {
                mimeType,
                body: fs.createReadStream(input.localPath),
            },
            fields: "id,modifiedTime",
            supportsAllDrives: true,
        });

        const fileId = response.data.id;
        if (!fileId) {
            throw new Error(
                "Google Drive did not return a file ID after overwrite."
            );
        }

        const result: OverwriteResult = {
            file: {
                id: fileId,
                provider: RemoteStorageProvider.GoogleDrive,
                metadata: input.file.metadata,
            },
        };

        const modifiedTime = response.data.modifiedTime;
        if (modifiedTime) {
            result.updatedAt = modifiedTime;
        }

        return result;
    }

    async delete(input: DeleteInput): Promise<DeleteResult> {
        await this.drive.files.delete({
            fileId: input.file.id,
            supportsAllDrives: true,
        });

        return {
            deleted: true,
            fileId: input.file.id,
        };
    }
}
