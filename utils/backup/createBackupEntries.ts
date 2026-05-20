import fs from "fs";

import buildBackupEntry from "./buildBackupEntry";
import collectBackupFiles from "./collectBackupFiles";
import resolveDriveBackupRoot from "./resolveDriveBackupRoot";
import type { BackupEntry, ScanContext } from "./types";

export default async function createBackupEntries(
    rootPath: string
): Promise<BackupEntry[]> {
    const collectedFiles: string[] = [];
    const rootRealPath = await fs.promises.realpath(rootPath);
    const driveBackupRoot = resolveDriveBackupRoot(rootRealPath);

    const scanContext: ScanContext = {
        rootRealPath,
        visitedRealDirectories: new Set([rootRealPath]),
        seenRealFiles: new Set(),
    };

    await collectBackupFiles(rootPath, collectedFiles, scanContext);

    const sortedFiles = collectedFiles.sort((a, b) => a.localeCompare(b));

    return sortedFiles.map((absolutePath) => {
        return buildBackupEntry(absolutePath, rootPath, driveBackupRoot);
    });
}
