import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';
import { Request, Response } from 'express';
import uploadPdfToStrapi from '../services/king_crimson/uploadResult';
import convertToPdf from '../services/king_crimson/convertToPdf';
import path from 'path';
import os from 'os';
import fs from 'fs';

export type ExternalWebhooksActions = 'print_pdf_cv';
const validActions = new Set<ExternalWebhooksActions>(['print_pdf_cv']);

const externalWebhooksController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;
    const passPhrase = payload.passPhrase;

    if (passPhrase !== process.env.EXTERNAL_WEBHOOKS_PASSPHRASE || !validActions.has(payload.action)) {
        logData({
            title: `Unauthorized attempt to use external webhook receiver`,
            data: payload,
            layer: 'external_http_requests',
            type: 'info',
            timeStamp: true,
        });

        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const apiKey = process.env.STRAPI_API_KEY;
    if (!apiKey) throw new Error('STRAPI_API_KEY is not set');

    const platformService = new PlatformService();
    platformService.setApiToken(apiKey);

    const action: ExternalWebhooksActions = payload.action;

    if (action === 'print_pdf_cv') {
        const { html_cv, strapi_job_id } = payload;

        logData({
            title: `Printing PDF CV`,
            data: {
                html_cv,
                strapi_job_id,
            },
            layer: 'external_http_requests',
            type: 'info',
            timeStamp: true,
        });

        const tempPdfPath = path.join(os.tmpdir(), `resume_${strapi_job_id}_${Date.now()}.pdf`);
        await convertToPdf(html_cv, tempPdfPath);
        const numericId = await uploadPdfToStrapi(tempPdfPath, strapi_job_id);

        await platformService.call('jJobRadarPutJJobRadarsById', {
            body: {
                data: {
                    custom_cv: numericId,
                },
            },
            path: { id: strapi_job_id },
        });

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

        res.status(200).json({ message: 'PDF printed and stored successfully' });
        return;
    }
};

export default externalWebhooksController;
