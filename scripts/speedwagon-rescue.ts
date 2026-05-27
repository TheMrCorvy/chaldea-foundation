import path from "path";
import { fileURLToPath } from "url";

import { restoreBackupEntries } from "../utils/restore_backup";

function isMainModule(): boolean {
    const entryArg = process.argv[1];
    if (!entryArg) {
        return false;
    }

    const currentFilePath = fileURLToPath(import.meta.url);
    return path.resolve(entryArg) === path.resolve(currentFilePath);
}

if (isMainModule()) {
    const rootPath = path.resolve(__dirname, "..");

    restoreBackupEntries(rootPath)
        .then((files) => {
            console.log(`Restored ${files.length} file(s):`);
            for (const file of files) {
                console.log(
                    `${file.relativePath} -> ${file.localPath} (id: ${file.driveId})`
                );
            }
        })
        .catch((error: unknown) => {
            console.error("Restore failed:", error);
            process.exitCode = 1;
        });
}
