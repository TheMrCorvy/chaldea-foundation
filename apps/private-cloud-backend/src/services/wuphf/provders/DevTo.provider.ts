import { DEV_TO_API_KEY, DEV_TO_ARTICLES_URL } from '@repo/config';
import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

import { logData } from '@repo/shared-utils/log-data';

export class DevToProvider implements WuphfProvider {
    readonly network = SocialNetworks.DEV_TO;

    private get authHeaders(): Record<string, string> {
        return {
            'api-key': DEV_TO_API_KEY,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
    }

    async post(content: WuphfPostContent): Promise<void> {
        const tags = content.hashtags
            .map(h => h.title.toLowerCase().replace(/[^a-z0-9]/g, ''))
            .filter(Boolean)
            .slice(0, 4);

        let coverImageUrl: string | undefined = undefined;

        if (content.coverImageUrl) {
            const imagesBaseUrl = process.env.IMAGES_BASE_URL ?? '';
            coverImageUrl = content.coverImageUrl.startsWith('http')
                ? content.coverImageUrl
                : `${imagesBaseUrl}${content.coverImageUrl}`;
        }

        const body = {
            article: {
                title: content.title,
                body_markdown: content.body,
                published: true,
                tags,
                cover_image: coverImageUrl,
            },
        };

        logData({
            title: 'Posting to DEV.to',
            data: { body },
            layer: 'external_http_requests',
            type: 'info',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        const response = await fetch(DEV_TO_ARTICLES_URL, {
            method: 'POST',
            headers: this.authHeaders,
            body: JSON.stringify(body),
        });

        logData({
            title: 'Received response from DEV.to',
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
                title: 'DEV.to post failed',
                data: { status: response.status, errorText },
                layer: 'external_http_responses',
                type: 'error',
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });
            throw new Error(`DEV.to post failed [${response.status}]: ${errorText}`);
        }
    }
}
