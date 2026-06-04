import { LINKEDIN_ACCESS_TOKEN, LINKEDIN_POSTS_URL, LINKEDIN_API_VERSION, LINKEDIN_PERSON_URN } from '@repo/config';
import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

import { logData } from '@repo/shared-utils/log-data';

const LINKEDIN_IMAGES_URL = 'https://api.linkedin.com/rest/images?action=initializeUpload';

export class LinkedInProvider implements WuphfProvider {
    readonly network = SocialNetworks.LINKEDIN;

    private get authHeaders(): Record<string, string> {
        return {
            Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
            'LinkedIn-Version': LINKEDIN_API_VERSION,
            'X-Restli-Protocol-Version': '2.0.0',
        };
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

    /**
     * Downloads an image from a URL and uploads it to LinkedIn.
     * Returns the LinkedIn image URN (e.g. "urn:li:image:XXXX").
     */
    private async uploadImage(imageUrl: string): Promise<string> {
        // Step 1 — Initialize the upload
        const initResponse = await fetch(LINKEDIN_IMAGES_URL, {
            method: 'POST',
            headers: { ...this.authHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                initializeUploadRequest: { owner: LINKEDIN_PERSON_URN },
            }),
        });

        if (!initResponse.ok) {
            const err = await initResponse.text();
            throw new Error(`LinkedIn image upload init failed [${initResponse.status}]: ${err}`);
        }

        const { value } = (await initResponse.json()) as {
            value: { uploadUrl: string; image: string };
        };

        // Step 2 — Fetch image bytes from the source URL
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image from source [${imageResponse.status}]: ${imageUrl}`);
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        const contentType = imageResponse.headers.get('content-type') ?? 'image/jpeg';

        // Step 3 — Upload the raw bytes to LinkedIn's upload URL
        const uploadResponse = await fetch(value.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: imageBuffer,
        });

        if (!uploadResponse.ok) {
            const err = await uploadResponse.text();
            throw new Error(`LinkedIn image binary upload failed [${uploadResponse.status}]: ${err}`);
        }

        return value.image;
    }

    async post(content: WuphfPostContent): Promise<void> {
        let imageUrn: string | null = null;

        if (content.coverImageUrl) {
            const imagesBaseUrl = process.env.IMAGES_BASE_URL ?? '';
            const absoluteImageUrl = content.coverImageUrl.startsWith('http')
                ? content.coverImageUrl
                : `${imagesBaseUrl}${content.coverImageUrl}`;

            logData({
                title: 'Uploading cover image to LinkedIn',
                data: { absoluteImageUrl },
                layer: 'external_http_requests',
                type: 'info',
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });
            imageUrn = await this.uploadImage(absoluteImageUrl);
        }

        const body: Record<string, unknown> = {
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

        if (imageUrn) {
            body['content'] = {
                media: { id: imageUrn },
            };
        }

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
            headers: { ...this.authHeaders, 'Content-Type': 'application/json' },
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
