import { Request, Response } from 'express';
import { logData } from '@salvatore.hakase/log-data';
import verifyPaths from '../utils/verifyPaths';
import { spawn } from 'child_process';

const v2EpisodeController = (req: Request, res: Response): void => {
    const startRaw = Number(req.query.start ?? 0);
    const start = (Number.isFinite(startRaw) && startRaw >= 0 ? startRaw : 0).toString();
    const parentDirectory = String(req.query.parentDirectory ?? '');
    const fileName = String(req.query.fileName ?? '');
    const fileType = String(req.query.fileType ?? 'mkv');
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

        res.status(500).json({ message: 'Server misconfiguration: ROOT path is not set.' });
        return;
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

        res.status(400).json({ message: 'Missing data in query parameters.' });
        return;
    }

    const videoPath = verifyPaths(ROOT, parentDirectory + '/', fullFileName);
    const audioPath = verifyPaths(ROOT, '.v2', parentDirectory + '/', fileName, '/audio/', audioIndex + '.m4a');

    if (!videoPath || !videoPath.startsWith(ROOT) || !audioPath || !audioPath.startsWith(ROOT)) {
        res.status(403).end();
        return;
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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
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
};

export default v2EpisodeController;
