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
    isTextBased?: boolean;
}

interface FFprobeTags {
    language?: string;
    LANGUAGE?: string;
}

interface FFprobeStream {
    index: number;
    codec_type?: string;
    codec_name?: string;
    channels?: number;
    tags?: FFprobeTags;
}

interface FFprobeData {
    streams?: FFprobeStream[];
}

interface VideoMetadata {
    duration?: number;
    audioTracks: AudioTrack[];
    subtitleTracks: SubtitleTrack[];
    extractedAt: string;
    everythingWorkedFine?: {
        subtitles: boolean;
        audio: boolean;
    };
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
 * Checks if a subtitle codec is text-based (can be converted to WebVTT)
 */
function isTextBasedSubtitle(codecName: string): boolean {
    const textBasedCodecs = [
        'subrip',
        'ass',
        'ssa',
        'webvtt',
        'srt',
        'vtt',
        'mov_text',
        'text',
        'microdvd',
        'jacosub',
        'realtext',
        'mpl2',
        'vplayer',
        'subviewer',
        'subviewer1',
        'sami',
        'pjs',
        'dks',
        'lrc',
        'stl',
    ];

    return textBasedCodecs.includes(codecName.toLowerCase());
}

/**
 * Extracts language from a stream object
 * Tries multiple sources: tags.language, disposition, and defaults to 'unknown'
 */
function extractLanguage(stream: FFprobeStream): string {
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
 * Checks if an output file exists and looks usable.
 */
async function hasProcessedOutput(outputPath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(outputPath);
        return stat.isFile() && stat.size > 0;
    } catch {
        return false;
    }
}

/**
 * Extracts metadata from a video file using ffprobe
 */
async function extractMetadata(filePath: string): Promise<VideoMetadata> {
    const ffprobeArgs = ['-v', 'error', '-show_streams', '-of', 'json', filePath];

    const output = await spawnProcess('ffprobe', ffprobeArgs);
    const data = JSON.parse(output) as FFprobeData;

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
                const isTextBased = isTextBasedSubtitle(stream.codec_name || '');
                subtitleTracks.push({
                    trackIndex: subtitleTrackCount,
                    language: extractLanguage(stream),
                    codec: stream.codec_name,
                    globalIndex: stream.index,
                    isTextBased,
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
async function extractAudioTracks(
    filePath: string,
    audioTracks: AudioTrack[],
    outputBaseDir: string
): Promise<boolean> {
    const audioDir = path.join(outputBaseDir, 'audio');

    // Create audio directory
    await fs.mkdir(audioDir, { recursive: true });

    for (const track of audioTracks) {
        const outputPath = path.join(audioDir, `${track.trackIndex}.m4a`);

        if (await hasProcessedOutput(outputPath)) {
            console.log(`Skipping audio track ${track.trackIndex}: output already exists at ${outputPath}`);
            continue;
        }

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
            // Continue processing other audio tracks even if one fails
            return false;
        }
    }
    return true;
}

/**
 * Extracts and converts subtitle tracks from a video file
 */
async function extractSubtitleTracks(
    filePath: string,
    subtitleTracks: SubtitleTrack[],
    outputBaseDir: string
): Promise<boolean> {
    const subtitleDir = path.join(outputBaseDir, 'subtitles');

    // Create subtitles directory
    await fs.mkdir(subtitleDir, { recursive: true });

    let allSucceeded = true;
    let skippedBitmapSubtitles = 0;

    for (const track of subtitleTracks) {
        // Skip bitmap-based subtitles that cannot be converted to WebVTT
        if (track.isTextBased === false) {
            console.warn(
                `Skipping bitmap subtitle track ${track.trackIndex} (${track.language}, ${track.codec}): ` +
                    `Cannot convert bitmap subtitles to WebVTT. These are image-based and require OCR for text conversion.`
            );
            skippedBitmapSubtitles++;
            continue;
        }

        const outputPath = path.join(subtitleDir, `${track.trackIndex}.vtt`);

        if (await hasProcessedOutput(outputPath)) {
            console.log(`Skipping audio track ${track.trackIndex}: output already exists at ${outputPath}`);
            continue;
        }

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
            allSucceeded = false;
        }
    }

    if (skippedBitmapSubtitles > 0) {
        console.warn(
            `Skipped ${skippedBitmapSubtitles} bitmap subtitle track(s) that cannot be converted to WebVTT format.`
        );
    }

    return allSucceeded;
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

    const everythingWorkedFine = {
        subtitles: false,
        audio: false,
    };

    // Extract subtitle tracks
    if (metadata.subtitleTracks.length > 0) {
        console.log(`Found ${metadata.subtitleTracks.length} subtitle track(s)`);
        everythingWorkedFine.subtitles = await extractSubtitleTracks(filePath, metadata.subtitleTracks, outputBaseDir);
    }

    // Extract audio tracks
    if (metadata.audioTracks.length > 0) {
        console.log(`Found ${metadata.audioTracks.length} audio track(s)`);
        everythingWorkedFine.audio = await extractAudioTracks(filePath, metadata.audioTracks, outputBaseDir);
    }

    return { ...metadata, everythingWorkedFine };
}
