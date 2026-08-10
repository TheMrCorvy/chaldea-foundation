import { logData } from '@salvatore.hakase/log-data';
import fs from 'fs';

const uploadPdfToStrapi = async (pdfPath: string, fileName: string): Promise<number> => {
    const strapiBaseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
    const strapiApiKey = process.env.STRAPI_API_KEY || process.env.STRAPI_REPORTS_API_KEY || '';

    const fileBuffer = fs.readFileSync(pdfPath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();

    formData.append('files', blob, fileName);

    const uploadUrl = `${strapiBaseUrl}/upload`;
    logData({
        title: 'Uploading PDF to Strapi',
        data: { uploadUrl, fileName },
        layer: 'external_http_requests',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });

    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${strapiApiKey}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload PDF to Strapi: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();

    if (!result || result.length === 0) {
        throw new Error('No PDF file returned from Strapi after upload');
    }

    logData({
        title: 'Successfully uploaded PDF to Strapi',
        data: result as Record<string, unknown>,
        layer: 'external_http_requests',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });

    return result[0]?.id; // Strapi V5 still uses numeric IDs for relations with media
};

export default uploadPdfToStrapi;
