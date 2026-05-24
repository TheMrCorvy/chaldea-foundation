export default function shouldBackupFile(
    fileName: string,
    directoryPath: string,
    allowedApps: string[],
    allowedExtensions: string[]
): boolean {
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

    const normalizedPath = directoryPath.replace(/\\/g, "/");
    const hasAllowedExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
    );
    const isInAllowedApp = allowedApps.some(
        (app) => normalizedPath.split(app).length > 1
    );

    if (hasAllowedExtension && isInAllowedApp) {
        return true;
    }

    return false;
}
