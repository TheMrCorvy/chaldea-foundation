const BASE_URL = "https://www.mediafire.com/api/1.5";

export async function getSessionToken(config: {
    email: string;
    password: string;
    appId: string;
    apiKey: string;
}): Promise<string> {
    const params = new URLSearchParams({
        email: config.email,
        password: config.password,
        application_id: config.appId,
        signature: config.apiKey,
        response_format: "json",
    });

    const response = await fetch(
        `${BASE_URL}/user/get_session_token.php?${params}`
    );

    if (!response.ok) {
        throw new Error("Failed to authenticate with MediaFire");
    }

    const data = await response.json();

    return data.response.session_token;
}
