import fs from "fs";
import path from "path";

import { download } from "@repo/remote-storage";

import type { BackupIdsEntry } from "../backup/types";
import type { RestoreResult } from "./types";

export default async function restoreSingleFile(
    entry: BackupIdsEntry,
    rootPath: string
): Promise<RestoreResult> {
    const absolutePath = path.resolve(rootPath, entry.relativePath);
    const parentDirectory = path.dirname(absolutePath);

    await fs.promises.mkdir(parentDirectory, { recursive: true });

    const exists = await fs.promises
        .access(absolutePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (exists) {
        await fs.promises.unlink(absolutePath);
    }

    await download({
        file: { id: entry.driveId },
        targetPath: absolutePath,
    });

    return {
        relativePath: entry.relativePath,
        localPath: absolutePath,
        driveId: entry.driveId,
    };
}
