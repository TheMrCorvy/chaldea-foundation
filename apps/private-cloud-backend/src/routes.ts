import { Router, Request, Response } from 'express';
import { serveVideoFileService } from './services/serveVideoFileService';
import { logData } from '@repo/shared-utils/log-data';
import { spawn } from 'child_process';
import verifyPaths from './utils/verifyPaths';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        message: 'Anime Private Cloud Backend is running.',
        timestamp: new Date().toISOString(),
    });
});

router.get('/api/v1/serve-episode', (req: Request, res: Response) => {
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
        return res.status(400).json({ message: 'Missing file path in query parameters.' });
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

        return res.status(500).json({ message: 'Server misconfiguration: ROOT path is not set.' });
    }

    const resolvedPath = verifyPaths(ROOT, filePath);

    if (!resolvedPath || !resolvedPath.startsWith(ROOT)) {
        return res.status(403).end();
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
        return res.status(status).json({ message, error });
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
        return res.status(500).json({ message: 'Stream or headers missing unexpectedly.' });
    }

    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.writeHead(status, headers);
    stream.pipe(res);
});

router.get('/api/v2/serve-episode/:fileType', (req, res) => {
    const startRaw = Number(req.query.start ?? 0);
    const start = (Number.isFinite(startRaw) && startRaw >= 0 ? startRaw : 0).toString();
    const parentDirectory = String(req.query.parentDirectory ?? '');
    const fileName = String(req.query.fileName ?? '');
    const fileType = String(req.params.fileType ?? 'mkv');
    const audioIndex = Number(req.query.audioIndex || 0);
    const fullFileName = `${fileName}.${fileType}`;
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

        return res.status(500).json({ message: 'Server misconfiguration: ROOT path is not set.' });
    }

    if (!parentDirectory || !fileName || !fileType) {
        logData({
            title: 'Some data was absent in the request to stream the video',
            layer: 'video_streaming',
            data: { parentDirectory, fileName, fileType },
            type: 'error',
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });

        return res.status(400).json({ message: 'Missing data in query parameters.' });
    }

    const videoPath = verifyPaths(ROOT, parentDirectory + '/', fullFileName);
    const audioPath = verifyPaths(ROOT, '.v2', parentDirectory + '/', fileName, '/audio/', audioIndex + '.m4a');

    if (!videoPath || !videoPath.startsWith(ROOT) || !audioPath || !audioPath.startsWith(ROOT)) {
        return res.status(403).end();
    }

    logData({
        title: 'Streaming episode ' + fullFileName,
        type: 'info',
        layer: 'video_streaming',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        data: { start, parentDirectory, fullFileName, audioIndex, videoPath, audioPath, fileType },
    });

    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Transfer-Encoding': 'chunked',
        'Accept-Ranges': 'none',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
    });

    const ffmpeg = spawn(
        'ffmpeg',
        [
            '-i',
            videoPath,
            '-i',
            audioPath,
            '-ss',
            start,
            '-map',
            '0:v:0',
            '-map',
            '1:a:0',
            '-c',
            'copy',
            '-shortest',
            '-avoid_negative_ts',
            'make_zero',
            '-movflags',
            '+frag_keyframe+empty_moov+default_base_moof',
            '-f',
            'mp4',
            'pipe:1',
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    ffmpeg.stdout.pipe(res);

    const killFfmpeg = (): void => {
        ffmpeg.kill('SIGKILL');
    };

    req.on('close', killFfmpeg);
    res.on('error', killFfmpeg);
});

// 404 handler
router.use((req: Request, res: Response) => {
    console.log(`404 Not Found: ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
    });
});

export default router;
