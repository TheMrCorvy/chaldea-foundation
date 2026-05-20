import {
    GOOGLE_DRIVE_CLIENT_ID,
    GOOGLE_DRIVE_CLIENT_SECRET,
    GOOGLE_DRIVE_FOLDER_ID,
    GOOGLE_DRIVE_REFRESH_TOKEN,
    GOOGLE_DRIVE_REDIRECT_URI,
} from "../config/config";

function maskValue(value: string): string {
    if (!value) {
        return "(empty)";
    }

    if (value.length <= 12) {
        return `${value.slice(0, 2)}***`;
    }

    return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function assertRequiredConfig(): void {
    const missing: string[] = [];

    if (!GOOGLE_DRIVE_CLIENT_ID) {
        missing.push("GOOGLE_DRIVE_CLIENT_ID");
    }

    if (!GOOGLE_DRIVE_CLIENT_SECRET) {
        missing.push("GOOGLE_DRIVE_CLIENT_SECRET");
    }

    if (!GOOGLE_DRIVE_REFRESH_TOKEN) {
        missing.push("GOOGLE_DRIVE_REFRESH_TOKEN");
    }

    if (missing.length > 0) {
        throw new Error(`Missing config values: ${missing.join(", ")}`);
    }
}

async function verifyGoogleDriveAuth(): Promise<void> {
    assertRequiredConfig();

    console.log("clientId:", maskValue(GOOGLE_DRIVE_CLIENT_ID));
    console.log("clientSecret:", maskValue(GOOGLE_DRIVE_CLIENT_SECRET));
    console.log("refreshToken:", maskValue(GOOGLE_DRIVE_REFRESH_TOKEN));
    console.log("redirectUri:", GOOGLE_DRIVE_REDIRECT_URI || "(empty)");
    console.log("folderId:", GOOGLE_DRIVE_FOLDER_ID || "(empty)");

    const tokenRequestBody = new URLSearchParams({
        client_id: GOOGLE_DRIVE_CLIENT_ID,
        client_secret: GOOGLE_DRIVE_CLIENT_SECRET,
        refresh_token: GOOGLE_DRIVE_REFRESH_TOKEN,
        grant_type: "refresh_token",
    });

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenRequestBody,
    });

    const tokenPayload = (await tokenResponse.json()) as {
        access_token?: string;
        error?: string;
        error_description?: string;
    };

    if (!tokenResponse.ok) {
        const errorCode = tokenPayload.error || "unknown_error";
        const errorDescription = tokenPayload.error_description || "No details";
        throw new Error(
            `Token refresh failed (${tokenResponse.status}): ${errorCode} - ${errorDescription}`
        );
    }

    const token = tokenPayload.access_token;

    if (!token) {
        throw new Error(
            "No access token returned. Verify client ID, client secret, and refresh token pair."
        );
    }

    console.log("Token refresh: OK");

    if (!GOOGLE_DRIVE_FOLDER_ID) {
        console.log("Folder check skipped: GOOGLE_DRIVE_FOLDER_ID is empty.");
        return;
    }

    const folderUrl = new URL(
        `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
            GOOGLE_DRIVE_FOLDER_ID
        )}`
    );

    folderUrl.searchParams.set("fields", "id,name,mimeType");
    folderUrl.searchParams.set("supportsAllDrives", "true");

    const folderResponse = await fetch(folderUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const folderPayload = (await folderResponse.json()) as {
        id?: string;
        name?: string;
        mimeType?: string;
        error?: {
            message?: string;
        };
    };

    if (!folderResponse.ok) {
        const folderErrorMessage =
            folderPayload.error?.message || "Folder check request failed.";
        throw new Error(
            `Folder check failed (${folderResponse.status}): ${folderErrorMessage}`
        );
    }

    const mimeType = folderPayload.mimeType;
    if (mimeType !== "application/vnd.google-apps.folder") {
        throw new Error(
            `Configured GOOGLE_DRIVE_FOLDER_ID is not a folder. mimeType=${String(mimeType)}`
        );
    }

    console.log("Folder access: OK");
    console.log(
        `Resolved folder: ${folderPayload.name || "(without name)"} (${folderPayload.id || "(without id)"})`
    );
}

verifyGoogleDriveAuth().catch((error: unknown) => {
    console.error("Google Drive auth verification failed:", error);
    process.exitCode = 1;
});
