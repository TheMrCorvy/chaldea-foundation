import type { BackupEntry, BackupIdsEntry, BackupIdsIndex } from "./types";

export default function findStoredEntry(
    index: BackupIdsIndex,
    file: BackupEntry
): BackupIdsEntry | null {
    for (const entry of index.backupIds) {
        if (!entry || typeof entry !== "object") {
            continue;
        }

        if (entry.relativePath !== file.relativePath) {
            continue;
        }

        if (entry.destinationPath !== file.destinationPath) {
            continue;
        }

        if (!entry.driveId || typeof entry.driveId !== "string") {
            continue;
        }

        return entry;
    }

    return null;
}
