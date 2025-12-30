import path from "path";

/**
 * Valida que un filePath no contenga secuencias peligrosas que puedan
 * permitir acceso a archivos fuera del directorio permitido
 */
export function isValidFilePath(filePath: string): boolean {
    // Verificar que no esté vacío
    if (!filePath || filePath.trim() === "") {
        return false;
    }

    // Normalizar el path para resolver .. y .
    const normalized = path.normalize(filePath);

    // Verificar que no contenga secuencias peligrosas
    const dangerousPatterns = [
        /\.\./, // Path traversal
        /\/\//, // Doble slash
        /^[a-z]:/i, // Drive letters (Windows) - podría ser válido dependiendo del sistema
        /^~/, // Home directory
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(normalized)) {
            return false;
        }
    }

    // Verificar que tenga una extensión de video válida
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

/**
 * Sanitiza un filePath removiendo caracteres peligrosos
 */
export function sanitizeFilePath(filePath: string): string {
    return path.normalize(filePath);
}
