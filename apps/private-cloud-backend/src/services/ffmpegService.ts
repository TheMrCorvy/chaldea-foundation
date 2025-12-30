import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

interface AudioTrack {
    globalIndex: number;
    trackIndex: number;
    language?: string;
    channels?: number;
    codec?: string;
}

interface SubtitleTrack {
    globalIndex: number;
    trackIndex: number;
    language?: string;
    codec?: string;
}

interface VideoMetadata {
    duration?: number;
    audioTracks: AudioTrack[];
    subtitleTracks: SubtitleTrack[];
    extractedAt: string;
}

/**
 * Spawns a child process and returns output as a promise
 */
function spawnProcess(command: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args);
        let stdout = '';
        let stderr = '';

        process.stdout.on('data', data => {
            stdout += data.toString();
        });

        process.stderr.on('data', data => {
            stderr += data.toString();
        });

        process.on('close', code => {
            if (code !== 0) {
                reject(new Error(`${command} exited with code ${code}: ${stderr}`));
            } else {
                resolve(stdout);
            }
        });

        process.on('error', err => {
            reject(err);
        });
    });
}

/**
 * Extracts language from a stream object
 * Tries multiple sources: tags.language, disposition, and defaults to 'unknown'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractLanguage(stream: any): string {
    // Check tags.language first
    if (stream.tags?.language) {
        return stream.tags.language;
    }

    // Check tags.LANGUAGE (alternative case)
    if (stream.tags?.LANGUAGE) {
        return stream.tags.LANGUAGE;
    }

    // Default to unknown
    return 'unknown';
}

/**
 * Extracts metadata from a video file using ffprobe
 */
async function extractMetadata(filePath: string): Promise<VideoMetadata> {
    const ffprobeArgs = ['-v', 'error', '-show_streams', '-of', 'json', filePath];

    const output = await spawnProcess('ffprobe', ffprobeArgs);
    const data = JSON.parse(output);

    const audioTracks: AudioTrack[] = [];
    const subtitleTracks: SubtitleTrack[] = [];
    let audioTrackCount = 0;
    let subtitleTrackCount = 0;

    if (data.streams) {
        for (const stream of data.streams) {
            if (stream.codec_type === 'audio') {
                audioTracks.push({
                    trackIndex: audioTrackCount,
                    language: extractLanguage(stream),
                    channels: stream.channels,
                    codec: stream.codec_name,
                    globalIndex: stream.index,
                });
                audioTrackCount++;
            } else if (stream.codec_type === 'subtitle') {
                subtitleTracks.push({
                    trackIndex: subtitleTrackCount,
                    language: extractLanguage(stream),
                    codec: stream.codec_name,
                    globalIndex: stream.index,
                });
                subtitleTrackCount++;
            }
        }
    }

    // Get duration
    const durationArgs = [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1:noprint_wrappers=1',
        filePath,
    ];

    let duration: number | undefined;
    try {
        const durationOutput = await spawnProcess('ffprobe', durationArgs);
        duration = parseFloat(durationOutput.trim());
    } catch (err) {
        // Duration extraction failed, continue without it
        console.error('Duration extraction failed, continue without it');
        console.log(err);
    }

    return {
        duration,
        audioTracks,
        subtitleTracks,
        extractedAt: new Date().toISOString(),
    };
}

/**
 * Extracts and re-encodes audio tracks from a video file
 */
async function extractAudioTracks(filePath: string, audioTracks: AudioTrack[], outputBaseDir: string): Promise<void> {
    const audioDir = path.join(outputBaseDir, 'audio');

    // Create audio directory
    await fs.mkdir(audioDir, { recursive: true });

    for (const track of audioTracks) {
        const outputPath = path.join(audioDir, `${track.trackIndex}.m4a`);

        // Determine bitrate based on channels
        const bitrate = (track.channels || 2) > 2 ? '384k' : '320k';

        const ffmpegArgs = [
            '-i',
            filePath,
            '-map',
            `0:${track.globalIndex}`,
            '-c:a',
            'aac',
            '-b:a',
            bitrate,
            '-ac',
            '2',
            '-y', // Overwrite output file
            outputPath,
        ];

        console.log(`Extracting audio track ${track.trackIndex} (${track.language}, ${track.codec}) to ${outputPath}`);
        try {
            await spawnProcess('ffmpeg', ffmpegArgs);
        } catch (err) {
            console.error(`Failed to extract audio track ${track.trackIndex}: ${err}`);
            throw err;
        }
    }
}

/**
 * Extracts and converts subtitle tracks from a video file
 */
async function extractSubtitleTracks(
    filePath: string,
    subtitleTracks: SubtitleTrack[],
    outputBaseDir: string
): Promise<void> {
    const subtitleDir = path.join(outputBaseDir, 'subtitles');

    // Create subtitles directory
    await fs.mkdir(subtitleDir, { recursive: true });

    for (const track of subtitleTracks) {
        const outputPath = path.join(subtitleDir, `${track.trackIndex}.vtt`);

        const ffmpegArgs = [
            '-i',
            filePath,
            '-map',
            `0:${track.globalIndex}`,
            '-c:s',
            'webvtt',
            '-y', // Overwrite output file
            outputPath,
        ];

        console.log(
            `Extracting subtitle track ${track.trackIndex} (${track.language}, ${track.codec}) to ${outputPath}`
        );
        try {
            await spawnProcess('ffmpeg', ffmpegArgs);
        } catch (err) {
            console.warn(`Failed to extract subtitle track ${track.trackIndex}: ${err}`);
            // Continue processing other subtitles even if one fails
        }
    }
}

/**
 * Processes a video file: extracts metadata, audio tracks, and subtitle tracks
 * @param filePath - Full path to the video file (e.g., ./volumes/anime/movie/movie-name.mkv)
 */
export async function processVideoFile(filePath: string): Promise<VideoMetadata> {
    if (!process.env.SECURE_BASE_PATH) {
        throw new Error('SECURE_BASE_PATH environment variable is not set');
    }

    // Verify file exists
    try {
        await fs.access(filePath);
    } catch {
        throw new Error(`Video file not found: ${filePath}`);
    }

    // Extract metadata
    console.log(`Extracting metadata from ${filePath}`);
    const metadata = await extractMetadata(filePath);

    // Build output directory structure
    const securePath = process.env.SECURE_BASE_PATH;
    const fileName = path.basename(filePath, path.extname(filePath));
    const fileDir = path.dirname(filePath);

    // Remove SECURE_BASE_PATH from the beginning of fileDir if it exists
    let relativePath = fileDir;
    if (fileDir.startsWith(securePath)) {
        relativePath = fileDir.slice(securePath.length);
        // Remove leading slash if present
        if (relativePath.startsWith('/')) {
            relativePath = relativePath.slice(1);
        }
    }

    const outputBaseDir = path.join(securePath + '/.v2', relativePath, fileName);

    console.log(`Output directory: ${outputBaseDir}`);

    // Create output base directory
    await fs.mkdir(outputBaseDir, { recursive: true });

    // Save metadata
    const metadataPath = path.join(outputBaseDir, 'metadata.json');
    await fs.writeFile(
        metadataPath,
        JSON.stringify(
            {
                duration: metadata.duration,
                audioTracks: metadata.audioTracks.map(track => ({
                    trackIndex: track.trackIndex,
                    language: track.language,
                    codec: track.codec,
                    channels: track.channels,
                })),
                subtitleTracks: metadata.subtitleTracks.map(track => ({
                    trackIndex: track.trackIndex,
                    language: track.language,
                    codec: track.codec,
                })),
                extractedAt: metadata.extractedAt,
            },
            null,
            2
        ),
        'utf-8'
    );
    console.log(`Metadata saved to ${metadataPath}`);

    // Extract subtitle tracks
    if (metadata.subtitleTracks.length > 0) {
        console.log(`Found ${metadata.subtitleTracks.length} subtitle track(s)`);
        await extractSubtitleTracks(filePath, metadata.subtitleTracks, outputBaseDir);
    }

    // Extract audio tracks
    if (metadata.audioTracks.length > 0) {
        console.log(`Found ${metadata.audioTracks.length} audio track(s)`);
        await extractAudioTracks(filePath, metadata.audioTracks, outputBaseDir);
    }

    return metadata;
}
