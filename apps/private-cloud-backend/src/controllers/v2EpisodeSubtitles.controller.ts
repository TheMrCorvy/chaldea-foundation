import { Request, Response } from 'express';
import { logData } from '@repo/shared-utils/log-data';
import verifyPaths from '../utils/verifyPaths';
import fs from 'fs';

const v2EpisodeSubtitlesController = (req: Request, res: Response): void => {
    const parentDirectory = String(req.query.parentDirectory ?? '');
    const fileName = String(req.query.fileName ?? '');
    const subtitleIndex = Number(req.query.subtitleIndex ?? 0);
    const ROOT = process.env.SECURE_BASE_PATH || '';

    if (!ROOT) {
        logData({
            layer: '*',
            title: 'Server misconfiguration: ROOT path is not set',
            data: {
                ROOT,
            },
            addSpaceAfter: true,
            addSeparatorAfter: true,
            timeStamp: true,
            type: 'error',
        });

        res.status(500).json({ message: 'Server misconfiguration: ROOT path is not set.' });
        return;
    }

    if (!parentDirectory || !fileName) {
        logData({
            title: 'Some data was absent in the request to stream the video',
            layer: 'video_streaming',
            data: { parentDirectory, fileName, subtitleIndex },
            type: 'error',
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });

        res.status(400).json({ message: 'Missing data in query parameters.' });
        return;
    }

    const subtitlePath = verifyPaths(
        ROOT,
        '.v2',
        parentDirectory + '/',
        fileName,
        '/subtitles/',
        subtitleIndex + '.vtt'
    );

    if (!subtitlePath || !subtitlePath.startsWith(ROOT)) {
        res.status(403).end();
        return;
    }

    const vtt = fs.readFileSync(subtitlePath, 'utf8');

    logData({
        layer: 'video_streaming_subtitles',
        type: 'info',
        data: { vtt },
        timeStamp: true,
        addSeparatorAfter: true,
        addSpaceAfter: true,
    });

    res.status(200)
        .set({
            'Content-Type': 'text/vtt; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Cache-Control': 'public, max-age=31536000, immutable',
        })
        .send(vtt);
};

export default v2EpisodeSubtitlesController;
