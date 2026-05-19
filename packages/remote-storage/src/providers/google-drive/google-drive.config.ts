import {
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_CLIENT_SECRET,
    GOOGLE_DRIVE_FOLDER_ID,
    GOOGLE_DRIVE_REFRESH_TOKEN,
    GOOGLE_DRIVE_REDIRECT_URI,
} from "../../../../../config/config";

export interface GoogleDriveConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    redirectUri: string;
    defaultFolderId?: string;
}

export function loadGoogleDriveConfig(): GoogleDriveConfig {
    return {
        clientId: GOOGLE_DRIVE_CLIENT_ID,
        clientSecret: GOOGLE_DRIVE_CLIENT_SECRET,
        refreshToken: GOOGLE_DRIVE_REFRESH_TOKEN,
        redirectUri: GOOGLE_DRIVE_REDIRECT_URI,
        defaultFolderId: GOOGLE_DRIVE_FOLDER_ID,
    };
}
