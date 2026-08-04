import { Request, Response } from 'express';
import { spawn } from 'child_process';
import verifyPaths from '../utils/verifyPaths';
import { logData } from '@salvatore.hakase/log-data';

const SEGMENT_DURATION = 10;

const v3EpisodeSegmentController = (req: Request, res: Response): void => {
    const parentDirectory = String(req.query.parentDirectory ?? '');
    const fileName = String(req.query.fileName ?? '');
    const fileType = String(req.query.fileType ?? 'mkv');
    const audioIndex = Number(req.query.audioIndex || 0);
    const segmentIndex = Number(req.query.segment ?? 0);
    const ROOT = process.env.SECURE_BASE_PATH || '';

    if (!ROOT) {
        logData({
            layer: '*',
            title: 'Server misconfiguration: ROOT path is not set',
            data: { ROOT },
            addSpaceAfter: true,
            addSeparatorAfter: true,
            timeStamp: true,
            type: 'error',
        });
        res.status(500).json({ message: 'Server misconfiguration: ROOT path is not set.' });
        return;
    }

    if (!parentDirectory || !fileName) {
        res.status(400).json({ message: 'Missing data in query parameters.' });
        return;
    }

    const fullFileName = `${fileName}.${fileType}`;
    const videoPath = verifyPaths(ROOT, parentDirectory + '/', fullFileName);
    const audioPath = verifyPaths(ROOT, '.v2', parentDirectory + '/', fileName, '/audio/', audioIndex + '.m4a');

    if (!videoPath || !videoPath.startsWith(ROOT) || !audioPath || !audioPath.startsWith(ROOT)) {
        res.status(403).end();
        return;
    }

    const startTime = (segmentIndex * SEGMENT_DURATION).toString();

    // HLS segments are static and should be cached to optimize performance and prevent repeated disk reads
    res.writeHead(200, {
        'Content-Type': 'video/MP2T',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'public, max-age=3600',
    });

    // FFmpeg setup: Input seeking (-ss before -i) for ultra-fast response (<100ms)
    // We stream copy (-c copy) the H.264 video and AAC audio into an MPEG-TS container
    const ffmpeg = spawn(
        'ffmpeg',
        [
            '-ss',
            startTime, // Input seek video file
            '-i',
            videoPath,
            '-ss',
            startTime, // Input seek audio file
            '-i',
            audioPath,
            '-t',
            SEGMENT_DURATION.toString(), // Extract exactly 10s chunk
            '-map',
            '0:v:0', // Map primary video track
            '-map',
            '1:a:0', // Map pre-extracted AAC audio
            '-c',
            'copy', // Stream copy: zero transcoding lag
            '-avoid_negative_ts',
            'make_zero',
            '-f',
            'mpegts', // Output container format
            'pipe:1',
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    ffmpeg.stdout.pipe(res);

    const killFfmpeg = (): void => {
        if (!ffmpeg.killed) {
            ffmpeg.kill('SIGKILL');
        }
    };

    // Kill process when client disconnects or connection closes
    req.on('close', killFfmpeg);
    res.on('error', killFfmpeg);
};

export default v3EpisodeSegmentController;
