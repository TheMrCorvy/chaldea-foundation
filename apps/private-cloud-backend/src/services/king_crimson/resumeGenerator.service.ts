import fs from 'fs';
import path from 'path';
import os from 'os';

import { logData } from '@salvatore.hakase/log-data';
import type { UpdatedResumeWebhookPayload } from '@repo/type-definitions/updated-resume';
import renderCvTemplate from './renderCvTemplate';
import convertHtmlToPdf from './convertToPdf';
import uploadPdfToStrapi from './uploadResult';

const apiBaseUrl = process.env.STRAPI_BASE_URL || 'http://localhost:1337/api';
const strapiHost = apiBaseUrl.endsWith('/api') ? apiBaseUrl.slice(0, -4) : apiBaseUrl;

/**
 * Service main function to process the Strapi webhook payload, fill the HTML resume template,
 * convert it to PDF using Puppeteer, upload to Strapi, and clean up temp files.
 */
export async function generateAndUploadResume(payload: UpdatedResumeWebhookPayload): Promise<void> {
    const entry = payload.entry;
    if (!entry) {
        throw new Error('No entry found in webhook payload');
    }

    logData({
        title: 'Starting resume generation (HTML to PDF)',
        data: { resumeId: entry.id, name: entry.name },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });

    const tempDir = os.tmpdir();
    const tempPdfPath = path.join(tempDir, `resume_${entry.id}_${Date.now()}.pdf`);

    try {
        // 1. Fetch QR code image if it exists
        let qrCodeDataUrl: string | undefined = undefined;
        const qrCodeUrl = entry.web_portfolio_qr_code?.url;
        if (qrCodeUrl) {
            const absoluteQrUrl = qrCodeUrl.startsWith('http') ? qrCodeUrl : `${strapiHost}${qrCodeUrl}`;
            try {
                logData({
                    title: 'Fetching QR code image',
                    data: { absoluteQrUrl },
                    layer: 'external_http_requests',
                    type: 'info',
                    timeStamp: true,
                    addSpaceAfter: true,
                    addSeparatorAfter: true,
                });
                const response = await fetch(absoluteQrUrl);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const qrCodeBuffer = Buffer.from(arrayBuffer);
                    const mimeType = entry.web_portfolio_qr_code?.mime || 'image/png';
                    qrCodeDataUrl = `data:${mimeType};base64,${qrCodeBuffer.toString('base64')}`;
                } else {
                    logData({
                        title: `Failed to fetch QR code image: ${response.statusText}`,
                        layer: 'external_http_requests',
                        type: 'warn',
                        timeStamp: true,
                        addSpaceAfter: true,
                        addSeparatorAfter: true,
                    });
                }
            } catch (err) {
                logData({
                    title: `Error fetching QR code image: ${String(err)}`,
                    layer: 'external_http_requests',
                    type: 'warn',
                    timeStamp: true,
                    addSpaceAfter: true,
                    addSeparatorAfter: true,
                });
            }
        }

        // 2. Render dynamic HTML Template
        logData({
            title: 'Rendering HTML Template',
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });
        const htmlContent = renderCvTemplate(entry, qrCodeDataUrl);

        // 3. Convert HTML to PDF via Puppeteer
        logData({
            title: 'Converting HTML to PDF via Puppeteer',
            data: { tempPdfPath },
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });
        await convertHtmlToPdf(htmlContent, tempPdfPath);

        // 4. Upload PDF to Strapi
        const uploadFileName = `${entry.name.replace(/\s+/g, '_')}_Resume.pdf`;
        await uploadPdfToStrapi(tempPdfPath, uploadFileName);

        logData({
            title: 'Resume generation and upload process complete',
            data: { name: entry.name },
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });
    } catch (err) {
        logData({
            title: 'Error generating or uploading resume',
            data: { error: String(err) },
            layer: 'queue_jobs',
            type: 'error',
            timeStamp: true,
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });
        throw err;
    } finally {
        // 5. Cleanup temp files immediately
        try {
            if (fs.existsSync(tempPdfPath)) {
                fs.unlinkSync(tempPdfPath);
                logData({
                    title: 'Cleaned up temporary PDF file',
                    data: { tempPdfPath },
                    layer: 'queue_jobs',
                    type: 'info',
                    timeStamp: true,
                    addSpaceAfter: true,
                    addSeparatorAfter: true,
                });
            }
        } catch (cleanupErr) {
            logData({
                title: 'Error cleaning up temp pdf',
                data: { error: String(cleanupErr) },
                layer: '*',
                type: 'error',
                timeStamp: true,
                addSpaceAfter: true,
                addSeparatorAfter: true,
            });
        }
    }
}
