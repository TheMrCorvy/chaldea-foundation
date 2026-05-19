import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { drive_v3 } from "googleapis";
import type { DownloadInput, DownloadResult } from "../../../types";

export async function downloadService(
    drive: drive_v3.Drive,
    input: DownloadInput
): Promise<DownloadResult> {
    let targetPath = path.join(os.tmpdir(), input.file.id);
    if (input.targetPath) {
        targetPath = input.targetPath;
    }

    const response = await drive.files.get(
        {
            fileId: input.file.id,
            alt: "media",
            supportsAllDrives: true,
        },
        { responseType: "stream" }
    );

    await pipeline(
        response.data as unknown as Readable,
        fs.createWriteStream(targetPath)
    );

    return { localPath: targetPath };
}
