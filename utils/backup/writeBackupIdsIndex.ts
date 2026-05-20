import fs from "fs";

import { BACKUP_IDS_FILE_PATH } from "./constants";
import type { BackupIdsIndex } from "./types";

export default async function writeBackupIdsIndex(
    index: BackupIdsIndex
): Promise<void> {
    const content = JSON.stringify(index, null, 4);
    await fs.promises.writeFile(BACKUP_IDS_FILE_PATH, `${content}\n`, "utf8");
}
