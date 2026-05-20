import fs from "fs";

import { CONFIG_FILE_PATH } from "./constants";

export default function readDriveBackupRootFromConfig(): string | null {
    try {
        const configContent = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
        let match = configContent.match(
            /^\s*export\s+const\s+DRIVE_ROOT_FOLDER\s*=\s*["']([^"']+)["']\s*;?/m
        );

        if (!match) {
            match = configContent.match(
                /^\s*export\s+const\s+DRIVE_BACKUP_ROOT\s*=\s*["']([^"']+)["']\s*;?/m
            );
        }

        if (!match) {
            return null;
        }

        const configuredPath = match[1].trim();
        if (!configuredPath) {
            return null;
        }

        return configuredPath;
    } catch {
        return null;
    }
}
