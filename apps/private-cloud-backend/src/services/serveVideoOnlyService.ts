import { logData } from '@repo/shared-utils/log-data';
import { createReadStream, statSync, existsSync } from 'fs';

interface ServeVideoOnlyParams {
    filePath: string;
    range: string | null;
}

interface VideoStreamResponse {
    stream?: NodeJS.ReadableStream;
    headers?: Record<string, string>;
    status: number;
    message: string;
    error?: string;
}

/**
 * Serves video-only stream from a file (mp4 or mkv)
 * For PoC: assumes video track is already extracted or serves mp4 directly
 * In production: use ffmpeg to extract video stream from mkv
 */
export const serveVideoOnlyService = ({ filePath, range }: ServeVideoOnlyParams): VideoStreamResponse => {
    try {
        const sourceFile = filePath;

        if (!existsSync(sourceFile)) {
            logData({
                title: 'Video file not found',
                layer: '*',
                data: { filePath, sourceFile },
                addSeparatorAfter: true,
                addSpaceAfter: true,
                type: 'error',
            });
            return {
                status: 404,
                message: 'Video file not found',
                error: 'File does not exist',
            };
        }

        const fileMetadata = statSync(sourceFile);
        const mimeType = 'video/mp4';

        if (!range) {
            const headers = {
                'Content-Type': mimeType,
                'Content-Length': fileMetadata.size.toString(),
                'Accept-Ranges': 'bytes',
            };
            const stream = createReadStream(sourceFile);

            logData({
                title: 'Serving video-only stream (no range)',
                layer: 'nas_service_v2_video',
                data: { sourceFile, size: fileMetadata.size },
                addSeparatorAfter: true,
                addSpaceAfter: true,
                type: 'info',
            });

            return { stream, headers, status: 200, message: 'Streaming video-only...' };
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
        const stream = createReadStream(sourceFile, { start, end });

        const headers = {
            'Content-Range': `bytes ${start}-${end}/${fileMetadata.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize.toString(),
            'Content-Type': mimeType,
        };

        logData({
            title: 'Serving video-only chunk',
            layer: 'nas_service_v2_video',
            data: { chunkSize, start, end, sourceFile },
            addSeparatorAfter: true,
            addSpaceAfter: true,
            type: 'info',
        });

        return { stream, headers, status: 206, message: 'Streaming video-only chunk...' };
    } catch (error) {
        console.error('Error streaming video-only:', error);
        return {
            status: 500,
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
