import path from "path";
import { fileURLToPath } from "url";

import {
    createBackupEntries,
    type BackupEntry,
    uploadBackupEntries,
} from "../utils/backup";

let backupMemory: BackupEntry[] = [];

export async function backup(
    rootPath = path.resolve(__dirname, "..")
): Promise<BackupEntry[]> {
    console.log("Initializing backup scan...");
    backupMemory = await createBackupEntries(rootPath);
    return [...backupMemory];
}

export async function upload(rootPath = path.resolve(__dirname, "..")) {
    const files = await backup(rootPath);
    return uploadBackupEntries(files);
}

export function getBackupMemory(): BackupEntry[] {
    return [...backupMemory];
}

function isMainModule(): boolean {
    const entryArg = process.argv[1];
    if (!entryArg) {
        return false;
    }

    const currentFilePath = fileURLToPath(import.meta.url);
    return path.resolve(entryArg) === path.resolve(currentFilePath);
}

if (isMainModule()) {
    upload()
        .then((files) => {
            console.log(`Uploaded ${files.length} .env file(s):`);
            for (const file of files) {
                console.log(
                    `${file.relativePath} -> ${file.destinationPath} (id: ${file.fileId})`
                );
            }
        })
        .catch((error: unknown) => {
            console.error("Backup scan failed:", error);
            process.exitCode = 1;
        });
}
