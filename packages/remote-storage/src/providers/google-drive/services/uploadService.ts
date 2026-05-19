import * as fs from "node:fs";
import * as path from "node:path";
import type { drive_v3 } from "googleapis";
import {
    RemoteStorageProvider,
    type UploadInput,
    type UploadResult,
} from "../../../types";

import { resolveDestination, toStringRecord } from "../utils";

export async function uploadService(
    drive: drive_v3.Drive,
    input: UploadInput,
    defaultFolderId?: string
): Promise<UploadResult> {
    const destination = await resolveDestination(
        drive,
        input.destinationPath,
        defaultFolderId
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

    const response = await drive.files.create({
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
        throw new Error("Google Drive did not return a file ID after upload.");
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
