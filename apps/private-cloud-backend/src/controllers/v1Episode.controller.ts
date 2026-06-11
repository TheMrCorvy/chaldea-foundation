import { Request, Response } from 'express';
import { serveVideoFileService } from '../services/serveVideoFile.service';
import { logData } from '@salvatore.hakase/log-data';
import verifyPaths from '../utils/verifyPaths';

const v1EpisodeController = (req: Request, res: Response): void => {
    const { filePath } = req.query as { filePath?: string; apiKey?: string };
    const range = req.headers.range || null;

    logData({
        title: 'Request received to serve an episode',
        layer: 'nas_service',
        data: { filePath, range },
        addSeparatorAfter: true,
        addSpaceAfter: true,
        type: 'info',
    });

    if (!filePath) {
        logData({
            title: 'Missing file path in query parameters',
            layer: '*',
            data: { filePath, range },
            addSeparatorAfter: true,
            addSpaceAfter: true,
            type: 'error',
        });
        res.status(400).json({ message: 'Missing file path in query parameters.' });
        return;
    }

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

    const resolvedPath = verifyPaths(ROOT, filePath);

    if (!resolvedPath || !resolvedPath.startsWith(ROOT)) {
        res.status(403).end();
        return;
    }

    const { stream, headers, status, message, error } = serveVideoFileService({ videoSrc: resolvedPath, range });

    if (error) {
        logData({
            title: 'Error getting the file from the disk',
            layer: '*',
            data: { stream, headers, status, message, error, resolvedPath },
            addSeparatorAfter: true,
            addSpaceAfter: true,
            type: 'error',
        });
        res.status(status).json({ message, error });
        return;
    }

    if (!stream || !headers) {
        logData({
            title: 'Stream or headers missing unexpectedly',
            layer: '*',
            data: { stream, headers, status, message, error, resolvedPath },
            addSeparatorAfter: true,
            addSpaceAfter: true,
            type: 'error',
        });
        res.status(500).json({ message: 'Stream or headers missing unexpectedly.' });
        return;
    }

    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.writeHead(status, headers);
    stream.pipe(res);
};

export default v1EpisodeController;
