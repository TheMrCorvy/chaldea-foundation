import type { StrapiWebhookPayload, BEpisodeEntry, BDirectoryEntry } from '../types/strapiWebhook.types';
import { Request, Response } from 'express';
import { logData } from '@salvatore.hakase/log-data';
import { addJobToQueue } from '../database/jobQueue';
import { JOB_TYPES } from '../services/jobProcessor.service';

const entryCreateWebhookController = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as StrapiWebhookPayload;

    if (payload.event !== 'entry.create') {
        logData({
            title: `Received non-entry.create event: ${payload.event}`,
            data: req.body,
            layer: 'webhooks_received',
            type: 'warn',
            addSeparatorAfter: true,
            addSpaceAfter: true,
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
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
    });

    if (payload.uid === 'api::b-episode.b-episode') {
        const episodeEntry = payload.entry as BEpisodeEntry;

        if (episodeEntry.version === 'V1') {
            res.status(200).json({ message: 'Webhook received successfully' });
            return;
        }

        await addJobToQueue(JOB_TYPES.PROCESS_EPISODE, {
            entry: episodeEntry,
        });

        logData({
            title: 'Episode processing job queued',
            data: episodeEntry,
            layer: 'webhooks_received',
            type: 'info',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        res.status(200).json({ message: 'Webhook received successfully' });
        return;
    }

    if (payload.uid === 'api::b-directory.b-directory') {
        const directoryEntry = payload.entry as BDirectoryEntry;

        await addJobToQueue(JOB_TYPES.PROCESS_DIRECTORY, {
            entry: directoryEntry,
        });

        logData({
            title: 'Directory processing job queued',
            data: directoryEntry,
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
        title: `Received unknown uid: ${payload.uid}`,
        data: req.body,
        layer: 'webhooks_received',
        type: 'warn',
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
    });

    res.status(404).json({ message: `Received unknown uid: ${payload.uid}` });
};

export default entryCreateWebhookController;
