import path from "path";

export function isValidFilePath(filePath: string): boolean {

    if (!filePath || filePath.trim() === "") {
        return false;
    }

    const normalized = path.normalize(filePath);
    const dangerousPatterns = [
        /\.\./,
        /\/\//,
        /^[a-z]:/i,
        /^~/,
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(normalized)) {
            return false;
        }
    }


    const validExtensions = [
        ".mp4",
        ".mkv",
        ".avi",
        ".mov",
        ".wmv",
        ".flv",
        ".webm",
        ".m4v",
        ".mpeg",
        ".mpg",
    ];

    const ext = path.extname(normalized).toLowerCase();
    if (!validExtensions.includes(ext)) {
        return false;
    }

    return true;
}

export function sanitizeFilePath(filePath: string): string {
    return path.normalize(filePath);
}
