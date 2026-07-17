import { ImageComponent } from '@repo/type-definitions/dynamic-page';
import { promises as fs } from 'fs';
import path from 'path';
import { logData } from '@salvatore.hakase/log-data';

export interface UploadDirectoryCoverParams {
    coverPath: string;
    apiKey: string;
}

export type UploadDirectoryCover = (params: UploadDirectoryCoverParams) => Promise<number>;

export const uploadDirectoryCover: UploadDirectoryCover = async ({ apiKey, coverPath }) => {
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

    logData({
        title: `Uploading cover image: ${coverPath}`,
        data: { uploadUrl, coverPath },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

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

    if (!result || result.length === 0) {
        throw new Error('No cover image returned from Strapi after upload');
    }

    logData({
        title: `Cover image uploaded successfully`,
        data: { result },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    return result[0]?.id; // Strapi V5 still uses numeric IDs for relations with media
};
