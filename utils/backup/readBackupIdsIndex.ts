import fs from "fs";

import { BACKUP_IDS_FILE_PATH } from "./constants";
import ensureBackupIdsFile from "./ensureBackupIdsFile";
import type { BackupIdsIndex } from "./types";

export default async function readBackupIdsIndex(): Promise<BackupIdsIndex> {
    await ensureBackupIdsFile();

    try {
        const content = await fs.promises.readFile(
            BACKUP_IDS_FILE_PATH,
            "utf8"
        );
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== "object") {
            return {
                backupIds: [],
            };
        }

        if (!Array.isArray(parsed.backupIds)) {
            return {
                backupIds: [],
            };
        }

        return parsed as BackupIdsIndex;
    } catch {
        return {
            backupIds: [],
        };
    }
}
