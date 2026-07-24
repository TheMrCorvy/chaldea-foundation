import type { SocialMediaEntry, StrapiWebhookPayload } from '../types/strapiWebhook.types';
import { Request, Response } from 'express';
import { logData } from '@salvatore.hakase/log-data';
import { JOB_TYPES } from '../services/jobProcessor.service';
import addJobToQueue from '../database/addJobToQueue';
import { SocialNetworks } from '../services/wuphf/types';
import type { UpdatedResumeWebhookPayload } from '@repo/type-definitions/updated-resume';
import { generateAndUploadResume } from '../services/king_crimson/resumeGenerator.service';

const entryPublishWebhookController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as StrapiWebhookPayload;
    const entry = payload.entry as SocialMediaEntry;

    if (payload.event !== 'entry.publish') {
        logData({
            title: `Received non-entry.publish event: ${payload.event}`,
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

    if (payload.uid === 'api::a-social-media-post.a-social-media-post') {
        if (entry.post_on_platform === 'All' || entry.post_on_platform === 'LinkedIn') {
            await addJobToQueue({
                type: JOB_TYPES.SOCIAL_MEDIA_POST,
                payload: {
                    networks: [SocialNetworks.LINKEDIN],
                    entry: entry,
                },
                name: 'Post to ' + entry.post_on_platform,
            });
        }

        if (entry.post_on_platform === 'All' || entry.post_on_platform === 'Dev.to') {
            await addJobToQueue({
                type: JOB_TYPES.SOCIAL_MEDIA_POST,
                payload: {
                    networks: [SocialNetworks.DEV_TO],
                    entry: entry,
                },
                name: 'Post to ' + entry.post_on_platform,
            });
        }

        logData({
            title: 'Social media post queued',
            data: {
                networks: [SocialNetworks.LINKEDIN, SocialNetworks.DEV_TO],
                entry: entry,
            },
            layer: 'webhooks_received',
            type: 'info',
            timeStamp: true,
        });

        res.status(200).json({ message: 'Webhook received successfully' });

        return;
    }

    if (payload.uid === 'api::updated-resume.updated-resume') {
        const resumePayload = req.body as UpdatedResumeWebhookPayload;
        try {
            await generateAndUploadResume(resumePayload);
            res.status(200).json({ message: 'Resume generated and uploaded successfully.' });
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
        return;
    }

    logData({
        title: `Received unknown event type: ${payload.event}`,
        data: req.body,
        layer: 'external_http_requests',
        type: 'warn',
        timeStamp: true,
    });

    res.status(404).json({ message: `Received unknown event type: ${payload.event}` });

    return;
};

export default entryPublishWebhookController;
