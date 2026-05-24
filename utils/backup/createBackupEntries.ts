import fs from "fs";

import {
    ALLOWED_APPS_FOR_MEDIA_BACKUP,
    ALLOWED_MEDIA_FILE_EXTENSIONS,
} from "../../config/config";
import buildBackupEntry from "./buildBackupEntry";
import collectBackupFiles from "./collectBackupFiles";
import ensureBackupIdsFile from "./ensureBackupIdsFile";
import resolveDriveBackupRoot from "./resolveDriveBackupRoot";
import type { BackupEntry, ScanContext } from "./types";

export default async function createBackupEntries(
    rootPath: string
): Promise<BackupEntry[]> {
    await ensureBackupIdsFile();

    const collectedFiles: string[] = [];
    const rootRealPath = await fs.promises.realpath(rootPath);
    const driveBackupRoot = resolveDriveBackupRoot(rootRealPath);

    const scanContext: ScanContext = {
        rootRealPath,
        visitedRealDirectories: new Set([rootRealPath]),
        seenRealFiles: new Set(),
        allowedApps: ALLOWED_APPS_FOR_MEDIA_BACKUP,
        allowedExtensions: ALLOWED_MEDIA_FILE_EXTENSIONS,
    };

    await collectBackupFiles(rootPath, collectedFiles, scanContext);

    const sortedFiles = collectedFiles.sort((a, b) => a.localeCompare(b));

    return sortedFiles.map((absolutePath) => {
        return buildBackupEntry(absolutePath, rootPath, driveBackupRoot);
    });
}
