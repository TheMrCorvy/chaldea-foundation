import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import verifyPaths from '../utils/verifyPaths';
import { logData } from '@salvatore.hakase/log-data';

const SEGMENT_DURATION = 10; // 10 seconds per segment

interface VideoMetadata {
    duration: string | number;
}

const v3EpisodePlaylistController = async (req: Request, res: Response): Promise<void> => {
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

    // Locate the pre-generated metadata.json
    const metadataPath = verifyPaths(ROOT, '.v2', parentDirectory + '/', fileName, '/metadata.json');
    if (!metadataPath || !metadataPath.startsWith(ROOT)) {
        res.status(403).end();
        return;
    }

    try {
        const metadataRaw = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataRaw) as VideoMetadata;
        const duration = Number(metadata.duration);

        if (!duration || isNaN(duration)) {
            throw new Error('Video duration not found or invalid in metadata.json.');
        }

        // Standard HLS VOD Header
        const lines: string[] = [
            '#EXTM3U',
            '#EXT-X-VERSION:3',
            `#EXT-X-TARGETDURATION:${SEGMENT_DURATION}`,
            '#EXT-X-MEDIA-SEQUENCE:0',
            '#EXT-X-PLAYLIST-TYPE:VOD',
        ];

        const totalSegments = Math.ceil(duration / SEGMENT_DURATION);
        for (let i = 0; i < totalSegments; i++) {
            const isLast = i === totalSegments - 1;
            const segDuration = isLast ? duration % SEGMENT_DURATION || SEGMENT_DURATION : SEGMENT_DURATION;

            lines.push(`#EXTINF:${segDuration.toFixed(6)},`);

            // Generate the segment URL path relative or absolute
            const queryParams = new URLSearchParams({
                parentDirectory,
                fileName,
                fileType,
                audioIndex: audioIndex.toString(),
                segment: i.toString(),
            });
            lines.push(`/api/v3/serve-episode/segment?${queryParams.toString()}`);
        }

        lines.push('#EXT-X-ENDLIST');

        // Write the HLS response with proper CORS headers for Chromecast compatibility
        res.writeHead(200, {
            'Content-Type': 'application/x-mpegURL',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        });

        res.end(lines.join('\n'));
    } catch (error: unknown) {
        logData({
            title: 'Failed to generate playlist',
            layer: 'video_streaming',
            type: 'error',
            data: { error: error instanceof Error ? error.message : error },
        });
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default v3EpisodePlaylistController;
