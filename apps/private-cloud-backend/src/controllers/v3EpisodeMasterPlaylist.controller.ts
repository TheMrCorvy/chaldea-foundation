import { Request, Response } from 'express';
import verifyPaths from '../utils/verifyPaths';
import { logData } from '@salvatore.hakase/log-data';

const v3EpisodeMasterPlaylistController = (req: Request, res: Response): void => {
    const parentDirectory = String(req.query.parentDirectory ?? '');
    const fileName = String(req.query.fileName ?? '');
    const fileType = String(req.query.fileType ?? 'mkv');
    const audioIndex = Number(req.query.audioIndex || 0);
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

    // Verify paths to make sure the target file directory structure is secure
    const metadataPath = verifyPaths(ROOT, '.v2', parentDirectory + '/', fileName, '/metadata.json');
    if (!metadataPath || !metadataPath.startsWith(ROOT)) {
        res.status(403).end();
        return;
    }

    logData({
        title: 'Generating HLS Master Playlist for ' + fileName,
        type: 'info',
        layer: 'video_streaming',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        data: { parentDirectory, fileName, fileType, audioIndex, metadataPath },
    });

    const apiKey = String(req.query.apiKey ?? (req as { apiKey?: string }).apiKey ?? '');
    // Multivariant (Master) Playlist lines
    const queryParams = new URLSearchParams({
        parentDirectory,
        fileName,
        fileType,
        audioIndex: audioIndex.toString(),
    });
    if (apiKey) {
        queryParams.set('apiKey', apiKey);
    }

    const lines: string[] = [
        '#EXTM3U',
        '#EXT-X-VERSION:3',
        '#EXT-X-STREAM-INF:BANDWIDTH=8000000,CODECS="avc1.64002a,mp4a.40.2",RESOLUTION=1920x1080',
        `/api/v3/serve-episode/playlist.m3u8?${queryParams.toString()}`,
    ];

    res.writeHead(200, {
        'Content-Type': 'application/x-mpegURL',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
    });

    res.end(lines.join('\n'));
};

export default v3EpisodeMasterPlaylistController;
