import { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_TOKEN_URL, LINKEDIN_REDIRECT_URI } from '@repo/config';

const getLinkedinRefreshToken = async (code: string): Promise<void> => {
    if (!code) {
        console.error('Error: No authorization code provided');
        console.log('');
        console.log('Usage:');
        console.log('  ts-node scripts/getLinkedInRefreshToken.ts <authorization_code>');
        console.log('');
        console.log('To get an authorization code, open this URL in your browser:');
        console.log(
            `  https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=w_member_social`
        );
        process.exit(1);
    }

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
    });

    const response = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
        console.error(`Token exchange failed [${response.status}]:`);
        console.error(JSON.stringify(data, null, 2));
        process.exit(1);
    }

    console.log('\n✅ Token exchange successful!\n');
    console.log(`access_token:  ${data['access_token']}`);
    console.log(`refresh_token: ${data['refresh_token']}`);
    console.log(`expires_in:    ${data['expires_in']} seconds`);
    if (data['refresh_token_expires_in']) {
        console.log(`refresh_token_expires_in: ${data['refresh_token_expires_in']} seconds`);
    }
    console.log('');
    console.log('👉 Copy the refresh_token value into config/config.ts → LINKEDIN_REFRESH_TOKEN');
};

export default getLinkedinRefreshToken;
