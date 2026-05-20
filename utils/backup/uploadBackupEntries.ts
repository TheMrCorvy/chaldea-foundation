import { overwrite, upload } from "@repo/remote-storage";
import readBackupIdsIndex from "./readBackupIdsIndex";
import syncSingleBackupFile from "./syncSingleBackupFile";
import writeBackupIdsIndex from "./writeBackupIdsIndex";
import type { BackupEntry } from "./types";

export default async function uploadBackupEntries(
    files: BackupEntry[]
): Promise<Array<BackupEntry & { fileId: string; checksum?: string }>> {
    const index = await readBackupIdsIndex();
    const storage = {
        upload,
        overwrite,
    };
    const uploadResults: Array<
        BackupEntry & { fileId: string; checksum?: string }
    > = [];
    const regularFiles: BackupEntry[] = [];
    const indexFiles: BackupEntry[] = [];

    for (const file of files) {
        if (file.relativePath === "specs/backupIds.json") {
            indexFiles.push(file);
            continue;
        }

        regularFiles.push(file);
    }

    for (const file of regularFiles) {
        const synced = await syncSingleBackupFile(file, index, storage);

        uploadResults.push({
            ...file,
            fileId: synced.fileId,
            checksum: synced.checksum,
        });
    }

    await writeBackupIdsIndex(index);

    for (const file of indexFiles) {
        const synced = await syncSingleBackupFile(file, index, storage);

        uploadResults.push({
            ...file,
            fileId: synced.fileId,
            checksum: synced.checksum,
        });
    }

    await writeBackupIdsIndex(index);

    for (const file of indexFiles) {
        await syncSingleBackupFile(file, index, storage);
    }

    return uploadResults;
}
