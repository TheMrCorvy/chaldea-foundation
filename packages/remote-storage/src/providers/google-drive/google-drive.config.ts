export interface GoogleDriveConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    redirectUri: string;
    defaultFolderId?: string;
}

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export function loadGoogleDriveConfig(): GoogleDriveConfig {
    return {
        clientId: requireEnv("GOOGLE_DRIVE_CLIENT_ID"),
        clientSecret: requireEnv("GOOGLE_DRIVE_CLIENT_SECRET"),
        refreshToken: requireEnv("GOOGLE_DRIVE_REFRESH_TOKEN"),
        redirectUri:
            process.env["GOOGLE_DRIVE_REDIRECT_URI"] ??
            "urn:ietf:wg:oauth:2.0:oob",
        defaultFolderId: process.env["GOOGLE_DRIVE_FOLDER_ID"],
    };
}
