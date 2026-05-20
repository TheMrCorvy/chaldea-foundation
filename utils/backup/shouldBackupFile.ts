export default function shouldBackupFile(fileName: string): boolean {
    if (
        fileName.includes(".example") ||
        fileName.includes(".sample") ||
        fileName.includes(".template")
    ) {
        return false;
    }

    if (fileName === ".env") {
        return true;
    }

    if (fileName.startsWith(".env.")) {
        return true;
    }

    if (fileName === "config.ts") {
        return true;
    }

    if (fileName === "backupIds.json") {
        return true;
    }

    return false;
}
