import type { StrapiWebhookPayload } from '../types/strapiWebhook.types';
import { Request, Response } from 'express';
import { logData } from '@repo/shared-utils/log-data';
import { addJobToQueue } from '../database/jobQueue';
import { JOB_TYPES } from '../services/jobProcessor.service';
import { SocialNetworks } from '../services/wuphf/types';

const strapiWebhookController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as StrapiWebhookPayload;

    logData({
        title: `Received ${payload.event} event from Platform Service`,
        data: req.body,
        layer: 'webhooks_received',
        type: 'info',
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
    });

    if (payload.event === 'entry.publish' && payload.uid === 'api::a-social-media-post.a-social-media-post') {
        await addJobToQueue(JOB_TYPES.SOCIAL_MEDIA_POST, {
            networks: [SocialNetworks.LINKEDIN],
            entry: payload.entry,
        });

        logData({
            title: 'LinkedIn post queued',
            data: {
                networks: [SocialNetworks.LINKEDIN],
                entry: payload.entry,
            },
            layer: 'webhooks_received',
            type: 'info',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        res.status(200).json({ message: 'Webhook received successfully' });

        return;
    }

    logData({
        title: `Received unknown event type: ${payload.event}`,
        data: req,
        layer: 'external_http_requests',
        type: 'warn',
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
    });

    res.status(404).json({ message: `Received unknown event type: ${payload.event}` });

    return;
};

export default strapiWebhookController;
