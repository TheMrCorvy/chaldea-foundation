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
export const LINKEDIN_ACCESS_TOKEN = "";
// Obtain your Person URN by calling GET https://api.linkedin.com/v2/userinfo with a valid
// access token. The "sub" field in the response is your person ID.
// Format: "urn:li:person:<sub>"
export const LINKEDIN_PERSON_URN = "";

export const LINKEDIN_REDIRECT_URI =
    "http://localhost:3030/linkedin/oauth-refresh-token";

export const LINKEDIN_POSTS_URL = "https://api.linkedin.com/rest/posts";
export const LINKEDIN_TOKEN_URL =
    "https://www.linkedin.com/oauth/v2/accessToken";
export const LINKEDIN_API_VERSION = "202605";

// DEV.to (Wuphf — API Key)
export const DEV_TO_API_KEY = "";
export const DEV_TO_ARTICLES_URL = "https://dev.to/api/articles";
