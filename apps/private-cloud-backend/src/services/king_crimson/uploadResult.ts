import { logData } from '@salvatore.hakase/log-data';
import fs from 'fs';

const uploadPdfToStrapi = async (pdfPath: string, fileName: string, strapiHost: string): Promise<void> => {
    const strapiApiKey = process.env.STRAPI_API_KEY || process.env.STRAPI_REPORTS_API_KEY || '';
    const fileBuffer = fs.readFileSync(pdfPath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('files', blob, fileName);

    const uploadUrl = `${strapiHost}/api/upload`;
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
    logData({
        title: 'Successfully uploaded PDF to Strapi',
        data: result as Record<string, unknown>,
        layer: 'external_http_requests',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });
};

export default uploadPdfToStrapi;
