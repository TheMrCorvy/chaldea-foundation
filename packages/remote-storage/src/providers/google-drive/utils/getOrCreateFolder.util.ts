import type { drive_v3 } from "googleapis";
import { escapeDriveQueryValue } from "./escapeDriveQueryValue.util";

export async function getOrCreateFolder(
    drive: drive_v3.Drive,
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

    const found = await drive.files.list({
        q: query,
        fields: "files(id)",
        pageSize: 1,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });

    const files = found.data.files;
    if (files && files.length > 0) {
        const firstFile = files[0];
        if (firstFile && firstFile.id) {
            return firstFile.id;
        }
    }

    const requestBody: drive_v3.Schema$File = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
    };

    if (parentId) {
        requestBody.parents = [parentId];
    }

    const created = await drive.files.create({
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
