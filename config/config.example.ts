/**
 * This file is meant to hold configuration values for the remote storage providers.
 */

// Google Drive
export const GOOGLE_DRIVE_CLIENT_ID = "";
export const GOOGLE_DRIVE_CLIENT_SECRET = "";
export const GOOGLE_DRIVE_REFRESH_TOKEN = "";
export const GOOGLE_DRIVE_REDIRECT_URI = "http://localhost:3000/callback";
export const GOOGLE_DRIVE_FOLDER_ID = "";

// Optional: if empty, scripts/backup.js uses the repository folder name.
export const DRIVE_ROOT_FOLDER = "";

export const ALLOWED_APPS_FOR_MEDIA_BACKUP = [];
export const ALLOWED_MEDIA_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

// LinkedIn (Wuphf — OAuth 2.0, scope: w_member_social openid profile)
export const LINKEDIN_CLIENT_ID = "";
export const LINKEDIN_CLIENT_SECRET = "";
export const LINKEDIN_REFRESH_TOKEN = "";
