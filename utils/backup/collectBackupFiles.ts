import fs from "fs";
import path from "path";

import { IGNORED_DIRECTORIES } from "./constants";
import isPathWithinRoot from "./isPathWithinRoot";
import shouldBackupFile from "./shouldBackupFile";
import type { ScanContext } from "./types";

export default async function collectBackupFiles(
    directoryPath: string,
    collector: string[],
    scanContext: ScanContext
): Promise<void> {
    const entries = await fs.promises.readdir(directoryPath, {
        withFileTypes: true,
    });

    for (const entry of entries) {
        const fullPath = path.resolve(directoryPath, entry.name);
        const realPath = await fs.promises.realpath(fullPath).catch(() => null);

        if (!realPath) {
            continue;
        }

        if (!isPathWithinRoot(realPath, scanContext.rootRealPath)) {
            continue;
        }

        const stat = await fs.promises.stat(fullPath).catch(() => null);
        if (!stat) {
            continue;
        }

        if (stat.isDirectory()) {
            if (IGNORED_DIRECTORIES.has(entry.name)) {
                continue;
            }

            if (scanContext.visitedRealDirectories.has(realPath)) {
                continue;
            }

            scanContext.visitedRealDirectories.add(realPath);
            await collectBackupFiles(fullPath, collector, scanContext);
            continue;
        }

        if (!stat.isFile()) {
            continue;
        }

        if (
            !shouldBackupFile(
                entry.name,
                directoryPath,
                scanContext.allowedApps,
                scanContext.allowedExtensions
            )
        ) {
            continue;
        }

        if (scanContext.seenRealFiles.has(realPath)) {
            continue;
        }

        scanContext.seenRealFiles.add(realPath);
        collector.push(fullPath);
    }
}
