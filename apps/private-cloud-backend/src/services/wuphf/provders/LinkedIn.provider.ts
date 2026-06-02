import {
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
    LINKEDIN_REFRESH_TOKEN,
    LINKEDIN_POSTS_URL,
    LINKEDIN_TOKEN_URL,
    LINKEDIN_API_VERSION,
    LINKEDIN_PERSON_URN,
} from '@repo/config';
import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class LinkedInProvider implements WuphfProvider {
    readonly network = SocialNetworks.LINKEDIN;

    private async getAccessToken(): Promise<string> {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: LINKEDIN_REFRESH_TOKEN,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET,
        });

        const response = await fetch(LINKEDIN_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        if (!response.ok) {
            throw new Error(`LinkedIn token refresh failed: ${response.status} ${response.statusText}`);
        }

        const data = (await response.json()) as { access_token: string };
        return data.access_token;
    }

    private buildCommentary(content: WuphfPostContent): string {
        const hashtags = content.hashtags
            .map(h => {
                // Remove whitespaces from the hashtags
                return `#${h.title.replace(/\s+/g, '')}`;
            })
            .join(' ');

        const parts = [content.title, content.body];

        if (hashtags) parts.push(hashtags);

        // Remove empty strings from title, and body
        return parts.filter(Boolean).join('\n\n');
    }

    async post(content: WuphfPostContent): Promise<void> {
        const accessToken = await this.getAccessToken();

        const body = {
            author: LINKEDIN_PERSON_URN,
            commentary: this.buildCommentary(content),
            visibility: 'PUBLIC',
            distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: [],
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false,
        };

        const response = await fetch(LINKEDIN_POSTS_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': LINKEDIN_API_VERSION,
                'X-Restli-Protocol-Version': '2.0.0',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LinkedIn post failed [${response.status}]: ${errorText}`);
        }
    }
}
