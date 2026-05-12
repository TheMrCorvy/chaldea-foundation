import type { DeleteFileOptions } from "./types.js";

import { MEDIAFIRE_API_BASE, parseJsonResponse } from "./utils.js";

interface DeleteResponse {
    response: {
        result: string;
    };
}

export async function deleteFile(
    sessionToken: string,
    options: DeleteFileOptions
) {
    const params = new URLSearchParams({
        session_token: sessionToken,
        quick_key: options.quickKey,
        response_format: "json",
    });

    const response = await fetch(
        `${MEDIAFIRE_API_BASE}/file/delete.php?${params}`
    );

    const data = await parseJsonResponse<DeleteResponse>(response);

    if (data.response.result !== "Success") {
        throw new Error("MediaFire failed deleting file");
    }

    return {
        success: true,
    };
}
