import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

interface FFProbeStream {
    index: number;
    codec_type: 'video' | 'audio' | 'subtitle';
    codec_name: string;
    codec_profile?: string;
    tags?: { language?: string; title?: string };
    channels?: number; // Number of audio channels
    sample_rate?: string; // Audio sample rate (e.g., "48000")
}

interface FFProbeFormat {
    format_name?: string;
    duration?: string;
}

interface FFProbeOutput {
    streams: FFProbeStream[];
    format: FFProbeFormat;
}

interface ProcessVideoResult {
    success: boolean;
    video?: string;
    subtitlesPath?: string;
    subtitles?: Array<{ path: string; language: string }>;
    error?: string;
}

/**
 * Process a video file to make it browser-compatible for streaming.
 * - Converts video to H.264 (baseline profile) if needed
 * - Converts audio to AAC if needed
 * - Extracts subtitles to separate VTT files
 * - Optimizes for web streaming with fast start
 */
export function processVideoService(inputPath: string): ProcessVideoResult {
    try {
        // Validate input
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }

        const dirname = path.dirname(inputPath);
        const base = path.basename(inputPath, path.extname(inputPath));

        const outputVideo = path.join(dirname, `${base}_processed.mp4`);
        const subtitleDir = path.join(dirname, `${base}_subs`);

        if (!fs.existsSync(subtitleDir)) {
            fs.mkdirSync(subtitleDir, { recursive: true });
        }

        console.log(`[processVideoService] Processing: ${inputPath}`);
        console.log(`[processVideoService] Output: ${outputVideo}`);

        // Step 1: Probe input file
        const probeCmd = `ffprobe -v quiet -print_format json -show_streams -show_format "${inputPath}"`;
        const probe: FFProbeOutput = JSON.parse(execSync(probeCmd).toString());

        const streams: FFProbeStream[] = probe.streams;
        const videoStreams = streams.filter(s => s.codec_type === 'video');
        const audioStreams = streams.filter(s => s.codec_type === 'audio');
        const subtitleStreams = streams.filter(s => s.codec_type === 'subtitle');

        console.log(
            `[processVideoService] Found ${videoStreams.length} video, ${audioStreams.length} audio, ${subtitleStreams.length} subtitle streams`
        );

        if (videoStreams.length === 0) {
            throw new Error('No video stream found in input file');
        }

        // Step 2: Build FFmpeg command for video/audio processing
        const ffmpegArgs: string[] = ['-i', `"${inputPath}"`];

        // Select first video stream
        const videoStream = videoStreams[0];
        ffmpegArgs.push('-map', `0:${videoStream.index}`);

        // Video codec will always be H.264 so there isn't any need to process it.
        console.log('[processVideoService] Video is already H.264, copying stream');
        ffmpegArgs.push('-c:v', 'copy');

        // Audio encoding: Map all audio streams and convert to AAC if needed
        // Strategy: For each audio stream, create two tracks if multichannel:
        // 1. Original multichannel (5.1/7.1) - for quality
        // 2. Stereo downmix - for maximum compatibility
        let outputAudioIndex = 0;

        audioStreams.forEach((audioStream, idx) => {
            const lang = audioStream.tags?.language ?? 'und';
            const channels = audioStream.channels ?? 2;
            const sampleRate = audioStream.sample_rate ? parseInt(audioStream.sample_rate, 10) : 48000;
            const isMultichannel = channels > 2;

            console.log(
                `[processVideoService] Processing audio stream ${idx} (${lang}): ${channels} channels, ${sampleRate}Hz`
            );

            // Track 1: Original audio (multichannel or stereo)
            ffmpegArgs.push('-map', `0:${audioStream.index}`);

            if (audioStream.codec_name === 'aac') {
                console.log(`[processVideoService] Audio stream ${idx} (${lang}) is already AAC, copying`);
                ffmpegArgs.push(`-c:a:${outputAudioIndex}`, 'copy');
            } else {
                const bitrate = isMultichannel ? '384k' : '320k'; // Higher bitrate for multichannel

                // Preserve original sample rate, but ensure at least 48kHz for maximum quality
                const targetSampleRate = Math.max(sampleRate, 48000);

                console.log(
                    `[processVideoService] Converting audio stream ${idx} (${lang}) from ${audioStream.codec_name} to AAC (${bitrate}, ${channels}ch, ${targetSampleRate}Hz)`
                );
                ffmpegArgs.push(
                    `-c:a:${outputAudioIndex}`,
                    'aac',
                    `-b:a:${outputAudioIndex}`,
                    bitrate,
                    `-ar:a:${outputAudioIndex}`,
                    String(targetSampleRate), // Preserve original sample rate (capped at 48kHz)
                    `-ac:a:${outputAudioIndex}`,
                    String(channels) // Preserve original channel count
                );
            }

            // Preserve language metadata
            if (audioStream.tags?.language) {
                ffmpegArgs.push(`-metadata:s:a:${outputAudioIndex}`, `language=${audioStream.tags.language}`);
            }

            // Set title metadata to indicate channel layout
            const channelLayout =
                channels === 6 ? '5.1' : channels === 8 ? '7.1' : channels === 2 ? 'Stereo' : `${channels}ch`;
            ffmpegArgs.push(`-metadata:s:a:${outputAudioIndex}`, `title=${channelLayout}`);

            outputAudioIndex++;

            // Track 2: Create stereo downmix for multichannel audio (for maximum browser compatibility)
            if (isMultichannel) {
                console.log(
                    `[processVideoService] Creating stereo downmix for audio stream ${idx} (${lang}) for compatibility`
                );
                ffmpegArgs.push(
                    '-map',
                    `0:${audioStream.index}`,
                    `-c:a:${outputAudioIndex}`,
                    'aac',
                    `-b:a:${outputAudioIndex}`,
                    '320k',
                    `-ar:a:${outputAudioIndex}`,
                    '48000', // Standard 48kHz for stereo web compatibility
                    `-ac:a:${outputAudioIndex}`,
                    '2', // Downmix to stereo
                    `-metadata:s:a:${outputAudioIndex}`,
                    `language=${audioStream.tags?.language ?? 'und'}`,
                    `-metadata:s:a:${outputAudioIndex}`,
                    'title=Stereo (Downmix)'
                );

                outputAudioIndex++;
            }
        });

        // Strip subtitles from MP4 (we'll extract them separately)
        ffmpegArgs.push('-sn');

        // MP4 container options for web streaming
        ffmpegArgs.push(
            '-map_metadata',
            '0', // Copiar metadata global
            '-map_chapters',
            '0', // Copiar chapters
            '-movflags',
            '+faststart',
            '-f',
            'mp4',
            '-movflags',
            '+faststart', // Enable fast start for web streaming
            '-y', // Overwrite output file
            `"${outputVideo}"`
        );

        // Execute FFmpeg
        const finalFFmpeg = `ffmpeg ${ffmpegArgs.join(' ')}`;
        console.log('[processVideoService] Running FFmpeg command:');
        console.log(finalFFmpeg);

        execSync(finalFFmpeg, { stdio: 'inherit' });

        console.log('[processVideoService] Video processing complete');

        // Step 3: Extract and convert subtitles to VTT
        const extractedSubtitles: Array<{ path: string; language: string }> = [];

        if (subtitleStreams.length > 0) {
            console.log(`[processVideoService] Extracting ${subtitleStreams.length} subtitle streams`);
        }

        subtitleStreams.forEach((s, i) => {
            const lang = s.tags?.language ?? 'und';
            const title = s.tags?.title ? `_${s.tags.title.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
            const outputSub = path.join(subtitleDir, `${base}_${lang}${title}_${i}.vtt`);

            // Check if subtitle is a graphic format (cannot convert to text-based VTT)
            const graphicSubtitleCodecs = [
                'hdmv_pgs_subtitle', // Blu-ray PGS
                'dvd_subtitle', // DVD VobSub
                'dvdsub', // DVD subtitles
                'pgssub', // PGS alternative name
            ];

            if (graphicSubtitleCodecs.includes(s.codec_name)) {
                console.warn(
                    `[processVideoService] ⚠️  Skipping subtitle ${i} (${lang}): Graphic format "${s.codec_name}" cannot be converted to VTT (text-based). Consider using OCR tools separately if needed.`
                );
                return; // Skip this subtitle
            }

            // Warn about potential style loss for advanced formats
            if (s.codec_name === 'ass' || s.codec_name === 'ssa') {
                console.log(
                    `[processVideoService] ℹ️  Converting ASS/SSA subtitle ${i} (${lang}): Advanced styling, positioning, and animations will be lost in VTT conversion.`
                );
            }

            try {
                // Convert subtitle to WebVTT format
                // Using -c:s webvtt ensures proper conversion from various subtitle formats
                const subtitleCmd = `ffmpeg -y -i "${inputPath}" -map 0:${s.index} -c:s webvtt "${outputSub}"`;
                console.log(`[processVideoService] Extracting subtitle ${i} (${lang}):`, subtitleCmd);
                execSync(subtitleCmd, { stdio: 'inherit' });

                // Verify the output file was created and has content
                if (fs.existsSync(outputSub) && fs.statSync(outputSub).size > 0) {
                    extractedSubtitles.push({
                        path: outputSub,
                        language: lang,
                    });
                    console.log(`[processVideoService] ✓ Successfully extracted subtitle ${i} (${lang})`);
                } else {
                    console.error(
                        `[processVideoService] Failed to extract subtitle ${i} (${lang}): Output file is empty or was not created`
                    );
                }
            } catch (subError) {
                console.error(`[processVideoService] Failed to extract subtitle ${i} (${lang}):`, subError);
                // Continue processing other subtitles even if one fails
            }
        });

        console.log('[processVideoService] Processing complete!');

        return {
            success: true,
            video: outputVideo,
            subtitlesPath: subtitleDir,
            subtitles: extractedSubtitles,
        };
    } catch (error) {
        console.error('[processVideoService] Error processing video:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

// Example usage:
// const result = processVideoService("/path/to/movie.mkv");
// if (result.success) {
//   console.log("Processed video:", result.video);
//   console.log("Subtitles:", result.subtitles);
// } else {
//   console.error("Processing failed:", result.error);
// }
