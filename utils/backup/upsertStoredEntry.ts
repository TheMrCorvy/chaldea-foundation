import path from "path";

import type { BackupEntry, BackupIdsIndex } from "./types";

export default function upsertStoredEntry(
    index: BackupIdsIndex,
    file: BackupEntry,
    driveId: string
): void {
    for (let i = 0; i < index.backupIds.length; i += 1) {
        const entry = index.backupIds[i];
        if (!entry || typeof entry !== "object") {
            continue;
        }

        if (entry.relativePath !== file.relativePath) {
            continue;
        }

        if (entry.destinationPath !== file.destinationPath) {
            continue;
        }

        index.backupIds[i] = {
            fileName: path.basename(file.absolutePath),
            localPath: file.absolutePath,
            relativePath: file.relativePath,
            driveId,
            destinationPath: file.destinationPath,
        };
        return;
    }

    index.backupIds.push({
        fileName: path.basename(file.absolutePath),
        localPath: file.absolutePath,
        relativePath: file.relativePath,
        driveId,
        destinationPath: file.destinationPath,
    });
}
