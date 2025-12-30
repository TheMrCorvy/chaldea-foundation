import { Router, Request, Response } from 'express';
import { serveVideoFileService } from './services/serveVideoFileService';
import path from 'path';
import { logData } from '@repo/shared-utils/log-data';
import { spawn } from 'child_process';

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

    const resolvedPath = path.resolve(decodeURIComponent(filePath));
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

router.get('/api/v2/serve-episode/:audioIndex', (req, res) => {
    const start = Number(req.query.start ?? 0);
    const parentDirectory = String(req.query.parentirectory ?? '');
    const fileName = String(req.query.fileName ?? '');

    if (!parentDirectory || !fileName) {
        return res.status(400).json({ message: 'Missing parentDirectory or fileName in query parameters.' });
    }

    const audioIndex = Number(req.params.audioIndex);

    logData({
        title: 'Streaming episode ' + fileName,
        type: 'info',
        layer: 'video_streaming',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        data: { start, parentDirectory, fileName, audioIndex },
    });

    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Transfer-Encoding': 'chunked',
        'Accept-Ranges': 'none',
    });

    const ffmpeg = spawn(
        'ffmpeg',
        [
            '-ss',
            String(start),
            '-i',
            '/Volumes/Disco 22TB/Peliculas de Anime/5cm Por Segundo.mkv',
            '-map',
            '0:v:0',
            '-map',
            '0:a:3',
            '-c',
            'copy',
            '-movflags',
            '+frag_keyframe+empty_moov+default_base_moof',
            '-f',
            'mp4',
            'pipe:1',
        ],
        {
            stdio: ['ignore', 'pipe', 'pipe'],
        }
    );

    ffmpeg.stdout.pipe(res);

    ffmpeg.stderr.on('data', data => {
        console.log(data);
    });

    req.on('close', () => {
        ffmpeg.kill('SIGKILL');
    });
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
