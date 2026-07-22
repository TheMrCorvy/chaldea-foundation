import type { StrapiWebhookPayload } from '../types/strapiWebhook.types';
import type { JobReport } from '@repo/type-definitions/jobs';
import { Request, Response } from 'express';
import { logData } from '@salvatore.hakase/log-data';
import deleteJobFromQueue from '../database/deleteJobFromQueue';

const entryDeleteWebhookController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as StrapiWebhookPayload;

    if (payload.event !== 'entry.delete') {
        logData({
            title: `Received non-entry.delete event: ${payload.event}`,
            data: req.body,
            layer: 'webhooks_received',
            type: 'warn',
            timeStamp: true,
        });

        res.status(400).json({ message: `Unsupported event type: ${payload.event}` });
        return;
    }

    logData({
        title: `Received ${payload.event} event from Platform Service`,
        data: req.body,
        layer: 'webhooks_received',
        type: 'info',
        timeStamp: true,
    });

    if (payload.uid === 'api::b-report.b-report') {
        const reportEntry = payload.entry as JobReport;
        const jobId = reportEntry.job_id;

        if (jobId === null || jobId === undefined) {
            logData({
                title: `Received delete event for report without a job_id: ${reportEntry.id}`,
                data: req.body,
                layer: 'webhooks_received',
                type: 'info',
                timeStamp: true,
            });

            res.status(200).json({ message: 'Webhook received successfully, no job_id to delete' });
            return;
        }

        logData({
            title: `Deleting job ${jobId} from queue due to report deletion`,
            data: req.body,
            layer: 'webhooks_received',
            type: 'info',
            timeStamp: true,
        });

        try {
            await deleteJobFromQueue(jobId);
        } catch (err) {
            logData({
                title: `Error deleting job ${jobId} from queue`,
                data: { error: String(err) },
                layer: '*',
                type: 'error',
                timeStamp: true,
            });
            res.status(500).json({ error: `Failed to delete job: ${String(err)}` });
        }

        res.status(200).json({ message: 'Webhook received and job deleted successfully' });
        return;
    }

    logData({
        title: `Received unknown uid: ${payload.uid}`,
        data: req.body,
        layer: 'webhooks_received',
        type: 'warn',
        timeStamp: true,
    });

    res.status(404).json({ message: `Received unknown uid: ${payload.uid}` });

    return;
};

export default entryDeleteWebhookController;
