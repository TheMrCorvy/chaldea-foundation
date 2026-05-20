import findStoredEntry from "./findStoredEntry";
import upsertStoredEntry from "./upsertStoredEntry";
import type { BackupEntry, BackupIdsIndex, StorageFunctions } from "./types";

export default async function syncSingleBackupFile(
    file: BackupEntry,
    index: BackupIdsIndex,
    storage: StorageFunctions
): Promise<{ fileId: string; checksum?: string }> {
    const storedEntry = findStoredEntry(index, file);
    let result: { file: { id: string }; checksum?: string; updatedAt?: string };

    if (storedEntry) {
        try {
            result = await storage.overwrite({
                file: {
                    id: storedEntry.driveId,
                    metadata: { relativePath: file.relativePath },
                },
                localPath: file.absolutePath,
                metadata: { relativePath: file.relativePath },
            });
        } catch {
            result = await storage.upload({
                localPath: file.absolutePath,
                destinationPath: file.destinationPath,
                metadata: { relativePath: file.relativePath },
            });
        }
    } else {
        result = await storage.upload({
            localPath: file.absolutePath,
            destinationPath: file.destinationPath,
            metadata: { relativePath: file.relativePath },
        });
    }

    const fileId = result.file.id;
    upsertStoredEntry(index, file, fileId);

    return {
        fileId,
        checksum: result.checksum,
    };
}
