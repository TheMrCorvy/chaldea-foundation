import { ImageComponent } from '@repo/type-definitions/dynamic-page';
import { promises as fs } from 'fs';
import path from 'path';

export const uploadDirectoryCover = async (coverPath: string): Promise<string | undefined> => {
    const apiKey = process.env.STRAPI_API_KEY ?? '';
    const apiBaseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
    const strapiHost = apiBaseUrl.endsWith('/api') ? apiBaseUrl.slice(0, -4) : apiBaseUrl;
    const uploadUrl = `${strapiHost}/api/upload`;

    if (!apiKey) {
        throw new Error('STRAPI_API_KEY is not set');
    }

    const fileBuffer = await fs.readFile(coverPath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('files', blob, path.basename(coverPath));

    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload cover: ${response.statusText} - ${errorText}`);
    }

    const result = (await response.json()) as ImageComponent[];
    return result[0]?.documentId;
};
