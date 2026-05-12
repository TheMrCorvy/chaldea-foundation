export const MEDIAFIRE_API_BASE = "https://www.mediafire.com/api/1.5";

export async function parseJsonResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(
            `MediaFire request failed with status ${response.status}`
        );
    }

    return response.json() as Promise<T>;
}

export async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
