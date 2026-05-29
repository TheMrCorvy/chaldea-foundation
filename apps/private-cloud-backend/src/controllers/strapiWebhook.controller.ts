import type { StrapiWebhookPayload } from '../types/strapiWebhook.types';
import { Request, Response } from 'express';
import { logData } from '@repo/shared-utils/log-data';

const strapiWebhookController = (req: Request, res: Response): void => {
    const payload = req.body as StrapiWebhookPayload;

    switch (payload.event) {
        case 'entry.create':
            logData({
                title: 'Received entry.create event from Platform Service',
                data: req.body,
                layer: 'webhooks_received',
                type: 'info',
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });

            break;
        case 'entry.update':
            console.log('Unsupported event type: entry.update - no action taken');
            break;
        case 'entry.delete':
            console.log('Unsupported event type: entry.delete - no action taken');
            break;
        case 'entry.publish':
            logData({
                title: 'Received entry.publish event from Platform Service',
                data: req.body,
                layer: 'webhooks_received',
                type: 'info',
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });

            break;
        case 'entry.unpublish':
            console.log('Unsupported event type: entry.unpublish - no action taken');
            break;

        case 'media.create':
            console.log('Unsupported event type: media.create - no action taken');
            break;
        case 'media.update':
            console.log('Unsupported event type: media.update - no action taken');
            break;
        case 'media.delete':
            console.log('Unsupported event type: media.delete - no action taken');
            break;
        case 'media.publish':
            console.log('Unsupported event type: media.publish - no action taken');
            break;
        case 'media.unpublish':
            console.log('Unsupported event type: media.unpublish - no action taken');
            break;

        default:
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
    }

    res.status(200).json({ message: 'Webhook received successfully' });
};

export default strapiWebhookController;
