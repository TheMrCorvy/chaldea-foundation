import * as path from "node:path";
import type { drive_v3 } from "googleapis";
import { getOrCreateFolder } from "./getOrCreateFolder.util";

export interface ResolvedDestination {
    parentId?: string;
    fileNameFromPath?: string;
}

export async function resolveDestination(
    drive: drive_v3.Drive,
    destinationPath: string,
    defaultFolderId?: string
): Promise<ResolvedDestination> {
    const rawPath = destinationPath.trim();
    const hasTrailingSlash = /[\\/]$/.test(rawPath);

    const normalizedPath = path.posix
        .normalize(rawPath.replace(/\\/g, "/"))
        .replace(/^\/+/, "");

    const segments = normalizedPath
        .split("/")
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0 && segment !== ".");

    let parentId = defaultFolderId;
    let fileNameFromPath: string | undefined;

    if (segments.length === 0) {
        return { parentId, fileNameFromPath };
    }

    const folderSegments = [...segments];

    if (!hasTrailingSlash) {
        const maybeFileName = folderSegments.pop();
        if (maybeFileName) {
            fileNameFromPath = maybeFileName;
        }
    }

    for (const folderName of folderSegments) {
        parentId = await getOrCreateFolder(drive, folderName, parentId);
    }

    return { parentId, fileNameFromPath };
}
