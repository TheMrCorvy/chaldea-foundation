import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import verifyPaths from '../utils/verifyPaths';
import { logData } from '@salvatore.hakase/log-data';

const DEFAULT_SEGMENT_DURATION = 6; // 6 seconds per segment for fast seek and responsive buffering

interface VideoMetadata {
    duration: string | number;
    videoCodec?: string;
    width?: number;
    height?: number;
    keyframes?: number[];
}

interface SegmentDef {
    start: number;
    duration: number;
    index: number;
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
        const totalDuration = Number(metadata.duration);

        if (!totalDuration || isNaN(totalDuration)) {
            throw new Error('Video duration not found or invalid in metadata.json.');
        }

        const apiKey = String(req.query.apiKey ?? (req as { apiKey?: string }).apiKey ?? '');
        const segments: SegmentDef[] = [];

        if (metadata.keyframes && metadata.keyframes.length > 1) {
            const keyframes = metadata.keyframes;
            let currentStart = keyframes[0] ?? 0;
            let segIdx = 0;

            for (let i = 1; i < keyframes.length; i++) {
                const kfTime = keyframes[i] ?? 0;
                const accumulatedDuration = kfTime - currentStart;

                // Group keyframes so segment duration is at least 4-6s or if it's the last keyframe
                if (accumulatedDuration >= 4 || i === keyframes.length - 1) {
                    segments.push({
                        index: segIdx++,
                        start: currentStart,
                        duration: accumulatedDuration,
                    });
                    currentStart = kfTime;
                }
            }

            // Tail segment to total duration if remaining
            if (currentStart < totalDuration && totalDuration - currentStart > 0.05) {
                segments.push({
                    index: segIdx++,
                    start: currentStart,
                    duration: totalDuration - currentStart,
                });
            }
        } else {
            // Fallback to fixed interval segments
            const totalSegments = Math.ceil(totalDuration / DEFAULT_SEGMENT_DURATION);
            for (let i = 0; i < totalSegments; i++) {
                const start = i * DEFAULT_SEGMENT_DURATION;
                const isLast = i === totalSegments - 1;
                const segDuration = isLast ? totalDuration - start : DEFAULT_SEGMENT_DURATION;
                segments.push({
                    index: i,
                    start,
                    duration: segDuration,
                });
            }
        }

        const maxSegmentDuration = Math.ceil(
            segments.reduce((max, seg) => Math.max(max, seg.duration), DEFAULT_SEGMENT_DURATION)
        );

        // Standard HLS VOD Header
        const lines: string[] = [
            '#EXTM3U',
            '#EXT-X-VERSION:3',
            `#EXT-X-TARGETDURATION:${maxSegmentDuration}`,
            '#EXT-X-MEDIA-SEQUENCE:0',
            '#EXT-X-PLAYLIST-TYPE:VOD',
        ];

        logData({
            title: 'Generating HLS Playlist for ' + fileName,
            type: 'info',
            layer: 'video_streaming',
            addSpaceAfter: true,
            addSeparatorAfter: true,
            data: { parentDirectory, fileName, duration: totalDuration, totalSegments: segments.length },
        });

        for (const seg of segments) {
            lines.push(`#EXTINF:${seg.duration.toFixed(6)},`);

            const queryParams = new URLSearchParams({
                parentDirectory,
                fileName,
                fileType,
                audioIndex: audioIndex.toString(),
                segment: seg.index.toString(),
                start: seg.start.toFixed(6),
                duration: seg.duration.toFixed(6),
            });
            if (apiKey) {
                queryParams.set('apiKey', apiKey);
            }
            lines.push(`/api/v3/serve-episode/segment?${queryParams.toString()}`);
        }

        lines.push('#EXT-X-ENDLIST');

        // Write the HLS response with proper CORS headers for Chromecast compatibility
        res.writeHead(200, {
            'Content-Type': 'application/x-mpegURL',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
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
