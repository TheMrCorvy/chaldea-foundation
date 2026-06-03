import { LINKEDIN_ACCESS_TOKEN, LINKEDIN_POSTS_URL, LINKEDIN_API_VERSION, LINKEDIN_PERSON_URN } from '@repo/config';
import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

import { logData } from '@repo/shared-utils/log-data';

export class LinkedInProvider implements WuphfProvider {
    readonly network = SocialNetworks.LINKEDIN;

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

        logData({
            title: 'Posting to LinkedIn',
            data: { body },
            layer: 'external_http_requests',
            type: 'info',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        const response = await fetch(LINKEDIN_POSTS_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': LINKEDIN_API_VERSION,
                'X-Restli-Protocol-Version': '2.0.0',
            },
            body: JSON.stringify(body),
        });

        logData({
            title: 'Received response from LinkedIn',
            data: response,
            layer: 'external_http_responses',
            type: response.ok ? 'info' : 'error',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        if (!response.ok) {
            const errorText = await response.text();
            logData({
                title: 'LinkedIn post failed',
                data: { status: response.status, errorText },
                layer: 'external_http_responses',
                type: 'error',
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });
            throw new Error(`LinkedIn post failed [${response.status}]: ${errorText}`);
        }
    }
}
