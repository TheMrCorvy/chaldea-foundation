import * as fs from "node:fs";
import type { drive_v3 } from "googleapis";
import {
    RemoteStorageProvider,
    type OverwriteInput,
    type OverwriteResult,
} from "../../../types";
import { toStringRecord } from "../utils";

export async function overwriteService(
    drive: drive_v3.Drive,
    input: OverwriteInput
): Promise<OverwriteResult> {
    const requestBody: drive_v3.Schema$File = {};

    if (input.metadata) {
        requestBody.appProperties = toStringRecord(input.metadata);
    }

    let mimeType = "application/octet-stream";
    if (input.mimeType) {
        mimeType = input.mimeType;
    }

    const response = await drive.files.update({
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
