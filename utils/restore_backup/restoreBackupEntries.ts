import readBackupIdsIndex from "../backup/readBackupIdsIndex";
import restoreSingleFile from "./restoreSingleFile";
import type { RestoreResult } from "./types";

export default async function restoreBackupEntries(
    rootPath: string
): Promise<RestoreResult[]> {
    const index = await readBackupIdsIndex();
    const results: RestoreResult[] = [];

    for (const entry of index.backupIds) {
        if (!entry || typeof entry !== "object") {
            continue;
        }

        const result = await restoreSingleFile(entry, rootPath);
        results.push(result);
    }

    return results;
}
