import fs from "fs";
import path from "path";

import { BACKUP_IDS_FILE_PATH } from "./constants";

export default async function ensureBackupIdsFile(): Promise<void> {
    const parentDirectory = path.dirname(BACKUP_IDS_FILE_PATH);
    await fs.promises.mkdir(parentDirectory, { recursive: true });

    const exists = await fs.promises
        .access(BACKUP_IDS_FILE_PATH, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (exists) {
        return;
    }

    const initialContent = JSON.stringify(
        {
            backupIds: [],
        },
        null,
        4
    );
    await fs.promises.writeFile(
        BACKUP_IDS_FILE_PATH,
        `${initialContent}\n`,
        "utf8"
    );
}
