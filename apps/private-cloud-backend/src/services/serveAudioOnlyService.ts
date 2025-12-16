import { logData } from '@repo/shared-utils/log-data';
import { createReadStream, statSync, existsSync } from 'fs';
import path from 'path';

interface ServeAudioOnlyParams {
    filePath: string;
    audioTrack?: number; // Track number, default 0
    range: string | null;
}

interface AudioStreamResponse {
    stream?: NodeJS.ReadableStream;
    headers?: Record<string, string>;
    status: number;
    message: string;
    error?: string;
}

/**
 * Serves audio-only stream from pre-processed audio files
 * Expected structure: .v2-{fileName}/audio/{trackNumber}.m4a relative to original video path
 */
export const serveAudioOnlyService = ({ filePath, range }: ServeAudioOnlyParams): AudioStreamResponse => {
    try {
        const audioTrack = 0; // For now we always stream track 0
        // Construct path to audio file
        // Example: /path/to/video.mkv -> /path/to/.v2-video/audio/0.m4a
        const dir = path.dirname(filePath);
        const base = path.basename(filePath, path.extname(filePath));
        const audioPath = path.join(dir, `.v2-${base}`, 'audio', `${audioTrack}.m4a`);

        if (!existsSync(audioPath)) {
            logData({
                title: 'Audio file not found',
                layer: '*',
                data: { filePath, audioPath, audioTrack },
                addSeparatorAfter: true,
                addSpaceAfter: true,
                type: 'error',
            });
            return {
                status: 404,
                message: 'Audio file not found',
                error: `Audio track ${audioTrack} does not exist`,
            };
        }

        const fileMetadata = statSync(audioPath);
        const mimeType = 'audio/mp4'; // m4a is mp4 audio

        if (!range) {
            const headers = {
                'Content-Type': mimeType,
                'Content-Length': fileMetadata.size.toString(),
                'Accept-Ranges': 'bytes',
            };
            const stream = createReadStream(audioPath);

            logData({
                title: 'Serving audio-only stream (no range)',
                layer: 'nas_service_v2_audio',
                data: { audioPath, audioTrack, size: fileMetadata.size },
                addSeparatorAfter: true,
                addSpaceAfter: true,
                type: 'info',
            });

            return { stream, headers, status: 200, message: 'Streaming audio-only...' };
        }

        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileMetadata.size - 1;

        if (start >= fileMetadata.size || end >= fileMetadata.size) {
            logData({
                title: 'Requested range not satisfiable',
                layer: '*',
                data: { start, end, fileSize: fileMetadata.size },
                addSeparatorAfter: true,
                addSpaceAfter: true,
                type: 'error',
            });
            return { status: 416, message: 'Requested range not satisfiable' };
        }

        const chunkSize = end - start + 1;
        const stream = createReadStream(audioPath, { start, end });

        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileMetadata.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize.toString(),
            'Content-Type': mimeType,
        };

        logData({
            title: 'Serving audio-only chunk',
            layer: 'nas_service_v2_audio',
            data: { chunkSize, start, end, audioPath, audioTrack },
            addSeparatorAfter: true,
            addSpaceAfter: true,
            type: 'info',
        });

        return { stream, headers, status: 206, message: 'Streaming audio-only chunk...' };
    } catch (error) {
        console.error('Error streaming audio-only:', error);
        return {
            status: 500,
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
