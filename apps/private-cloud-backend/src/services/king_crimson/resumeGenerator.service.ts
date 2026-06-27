import fs from 'fs';
import path from 'path';
import os from 'os';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { logData } from '@salvatore.hakase/log-data';
import type { UpdatedResumeWebhookPayload } from '@repo/type-definitions/updated-resume';
import cleanMarkdown from './cleanMarkdown';
import convertDocxToPdf from './convertToPdf';
import uploadPdfToStrapi from './uploadResult';

const apiBaseUrl = process.env.STRAPI_BASE_URL || 'http://localhost:1337/api';
const strapiHost = apiBaseUrl.endsWith('/api') ? apiBaseUrl.slice(0, -4) : apiBaseUrl;
/**
 * Service main function to process the Strapi webhook payload, fill the resume template,
 * convert it to PDF, upload to Strapi, and clean up temp files.
 */
export async function generateAndUploadResume(payload: UpdatedResumeWebhookPayload): Promise<void> {
    const entry = payload.entry;
    if (!entry) {
        throw new Error('No entry found in webhook payload');
    }

    logData({
        title: 'Starting resume generation',
        data: { resumeId: entry.id, name: entry.name },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });

    const tempDir = os.tmpdir();
    const tempDocxPath = path.join(tempDir, `resume_${entry.id}_${Date.now()}.docx`);
    const tempPdfPath = path.join(tempDir, `resume_${entry.id}_${Date.now()}.pdf`);

    try {
        // 1. Fetch QR code image if it exists
        let qrCodeBuffer: Buffer | null = null;
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
                    qrCodeBuffer = Buffer.from(arrayBuffer);
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

        // 2. Open template docx
        const templatePath = path.resolve(__dirname, '../../assets/resume_template.docx');
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found at ${templatePath}`);
        }
        const templateContent = fs.readFileSync(templatePath);
        const zip = new PizZip(templateContent);

        // 3. Replace QR code image in zip if we successfully fetched it
        if (qrCodeBuffer) {
            zip.file('media/image.png', qrCodeBuffer, { binary: true });
        }

        // 4. Set up docxtemplater and render data
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            delimiters: {
                start: '{{',
                end: '}}',
            },
            parser: (tag: string): { get: (scope: unknown) => unknown } => {
                return {
                    get: (scope: unknown): unknown => {
                        if (tag === '.') return scope;
                        const normalizedPath = tag.replace(/\[(\d+)\]/g, '.$1');
                        const parts = normalizedPath.split('.');
                        let current: unknown = scope;
                        for (const part of parts) {
                            if (current === null || current === undefined) {
                                return '';
                            }
                            if (typeof current === 'object') {
                                current = (current as Record<string, unknown>)[part];
                            } else {
                                return '';
                            }
                        }
                        return current ?? '';
                    },
                };
            },
        });

        // Map Education
        const educationItems = entry.education_list_items || [];
        const careers = educationItems.map(item => ({
            title: item.title || '',
            institute: item.institute || '',
            country: item.country || '',
            from: item.from || '',
            until: item.until || '',
        }));

        // Map Experience
        const experienceItems = entry.experience_list_items || [];
        const work_items = experienceItems.map(item => ({
            position: item.position || '',
            company: item.company || '',
            client: item.client || '',
            location: item.location || '',
            from: item.from || '',
            until: item.until || '',
            rich_text_description: cleanMarkdown(item.description),
        }));

        const backgroundText = entry.background_rich_text || entry.background || '';

        const templateData = {
            name: entry.name || '',
            job_title: entry.title || '',
            email: entry.email || '',
            website: entry.website || '',
            github_profile_link: entry.github_profile_link || '',
            background_rich_text: cleanMarkdown(backgroundText),
            careers,
            work_items,
        };

        doc.render(templateData);

        const renderedBuffer = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        fs.writeFileSync(tempDocxPath, renderedBuffer);

        // 5. Convert DOCX to PDF
        logData({
            title: 'Converting DOCX to PDF via Word COM Automation',
            data: { tempDocxPath, tempPdfPath },
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });

        await convertDocxToPdf(tempDocxPath, tempPdfPath);

        // 6. Upload PDF to Strapi
        const uploadFileName = `${entry.name.replace(/\s+/g, '_')}_Resume.pdf`;
        await uploadPdfToStrapi(tempPdfPath, uploadFileName, strapiHost);

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
        // 7. Cleanup temp files immediately
        try {
            if (fs.existsSync(tempDocxPath)) {
                fs.unlinkSync(tempDocxPath);
                logData({
                    title: 'Cleaned up temporary DOCX file',
                    data: { tempDocxPath },
                    layer: 'queue_jobs',
                    type: 'info',
                    timeStamp: true,
                    addSpaceAfter: true,
                    addSeparatorAfter: true,
                });
            }
        } catch (cleanupErr) {
            logData({
                title: 'Error cleaning up temp docx',
                data: { error: String(cleanupErr) },
                layer: '*',
                type: 'error',
                timeStamp: true,
                addSpaceAfter: true,
                addSeparatorAfter: true,
            });
        }
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
