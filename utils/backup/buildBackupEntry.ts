import path from "path";

import type { BackupEntry } from "./types";
import toPosixPath from "./toPosixPath";

export default function buildBackupEntry(
    absolutePath: string,
    rootPath: string,
    driveBackupRoot: string
): BackupEntry {
    const relativePath = path.relative(rootPath, absolutePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error(
            `Cannot create backup entry outside monorepo root: ${absolutePath}`
        );
    }

    const normalizedRelativePath = toPosixPath(relativePath);
    const destinationPath = `${driveBackupRoot}/${normalizedRelativePath}`;

    return {
        absolutePath,
        relativePath: normalizedRelativePath,
        destinationPath,
    };
}
