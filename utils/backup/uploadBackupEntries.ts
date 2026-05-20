import findStoredEntry from "./findStoredEntry";
import loadStorageFunctions from "./loadStorageFunctions";
import readBackupIdsIndex from "./readBackupIdsIndex";
import upsertStoredEntry from "./upsertStoredEntry";
import writeBackupIdsIndex from "./writeBackupIdsIndex";
import type { BackupEntry } from "./types";

export default async function uploadBackupEntries(
    files: BackupEntry[]
): Promise<Array<BackupEntry & { fileId: string; checksum?: string }>> {
    const index = await readBackupIdsIndex();
    const storage = await loadStorageFunctions();
    const uploadResults: Array<
        BackupEntry & { fileId: string; checksum?: string }
    > = [];

    for (const file of files) {
        const storedEntry = findStoredEntry(index, file);
        let result: {
            file: { id: string };
            checksum?: string;
            updatedAt?: string;
        };

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

        uploadResults.push({
            ...file,
            fileId,
            checksum: result.checksum,
        });
    }

    await writeBackupIdsIndex(index);
    return uploadResults;
}
