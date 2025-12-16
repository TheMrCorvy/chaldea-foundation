import { execSync, spawnSync } from 'child_process';
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

interface AudioTrackInfo {
    index: number;
    path: string;
    language: string;
    channels: number;
    sampleRate: number;
    codec: string;
    title?: string;
}

interface SubtitleTrackInfo {
    index: number;
    path: string;
    language: string;
    title?: string;
}

interface ProcessVideoResult {
    success: boolean;
    originalVideo: string;
    audioTracks?: AudioTrackInfo[];
    subtitleTracks?: SubtitleTrackInfo[];
    audioPath?: string;
    subtitlesPath?: string;
    error?: string;
}

/**
 * Process a video file to extract audio and subtitle tracks for MSE streaming.
 * - Leaves the original video file intact
 * - Extracts each audio track to .v2-{fileName}/audio/{index}.m4a
 * - Extracts each subtitle track to .v2-{fileName}/subtitles/{index}.vtt
 * - Maintains high quality AAC audio with secure timestamps
 */
export function processVideoService(inputPath: string): ProcessVideoResult {
    try {
        // Validate input
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }

        const dirname = path.dirname(inputPath);
        const base = path.basename(inputPath, path.extname(inputPath));

        // Create .v2-{fileName} directory structure
        const v2Dir = path.join(dirname, `.v2-${base}`);
        const audioDir = path.join(v2Dir, 'audio');
        const subtitleDir = path.join(v2Dir, 'subtitles');

        // Ensure directories exist
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
        if (!fs.existsSync(subtitleDir)) {
            fs.mkdirSync(subtitleDir, { recursive: true });
        }

        console.log(`[processVideoService] Processing: ${inputPath}`);
        console.log(`[processVideoService] Audio output dir: ${audioDir}`);
        console.log(`[processVideoService] Subtitles output dir: ${subtitleDir}`);

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

        // Step 2: Extract audio tracks individually
        const extractedAudioTracks: AudioTrackInfo[] = [];

        audioStreams.forEach((audioStream, idx) => {
            const lang = audioStream.tags?.language ?? 'und';
            const channels = audioStream.channels ?? 2;
            const sampleRate = audioStream.sample_rate ? parseInt(audioStream.sample_rate, 10) : 48000;
            const title = audioStream.tags?.title;

            // Output path: .v2-{fileName}/audio/{index}.m4a
            const outputAudio = path.join(audioDir, `${idx}.m4a`);

            console.log(
                `[processVideoService] Extracting audio track ${idx} (${lang}): ${channels} channels, ${sampleRate}Hz`
            );

            // Build FFmpeg command for this audio track
            const targetSampleRate = Math.max(sampleRate, 48000);

            const ffmpegArgs: string[] = [
                'ffmpeg',
                '-i',
                inputPath,
                '-map',
                `0:${audioStream.index}`, // Map this specific audio stream
                '-vn', // No video
                '-sn', // No subtitles
                '-fflags',
                '+genpts', // Generate presentation timestamps
            ];

            // Determine codec and encoding parameters
            if (audioStream.codec_name === 'aac') {
                console.log(`[processVideoService] Audio track ${idx} is already AAC, copying stream`);
                ffmpegArgs.push('-c:a', 'copy');
            } else {
                // Convert to AAC with high quality
                const bitrate = channels > 2 ? '384k' : '320k';

                console.log(
                    `[processVideoService] Converting audio track ${idx} from ${audioStream.codec_name} to AAC (${bitrate}, ${channels}ch, ${targetSampleRate}Hz)`
                );

                ffmpegArgs.push(
                    '-c:a',
                    'aac',
                    '-b:a',
                    bitrate,
                    '-ar',
                    String(targetSampleRate),
                    '-ac',
                    String(channels)
                );
            }

            // Add metadata
            ffmpegArgs.push('-metadata', `language=${lang}`);
            if (title) {
                ffmpegArgs.push('-metadata', `title=${title}`);
            }

            // Output format
            ffmpegArgs.push(
                '-f',
                'mp4',
                '-movflags',
                '+faststart', // Fast start for streaming
                '-y', // Overwrite
                outputAudio
            );

            // Execute FFmpeg
            console.log(`[processVideoService] Running ffmpeg for audio track ${idx}...`);
            console.log(`[processVideoService] Command: ffmpeg ${ffmpegArgs.slice(1).join(' ')}`);

            try {
                const result = spawnSync('ffmpeg', ffmpegArgs.slice(1), {
                    stdio: 'inherit',
                });

                if (result.error) {
                    throw result.error;
                }

                if (result.status !== 0) {
                    throw new Error(`FFmpeg exited with code ${result.status}`);
                }

                if (fs.existsSync(outputAudio) && fs.statSync(outputAudio).size > 0) {
                    extractedAudioTracks.push({
                        index: idx,
                        path: outputAudio,
                        language: lang,
                        channels,
                        sampleRate: targetSampleRate || sampleRate,
                        codec: 'aac',
                        title: title || undefined,
                    });
                    console.log(`[processVideoService] ✓ Successfully extracted audio track ${idx} (${lang})`);
                } else {
                    console.error(
                        `[processVideoService] Failed to extract audio track ${idx}: Output file missing or empty`
                    );
                }
            } catch (error) {
                console.error(`[processVideoService] Error extracting audio track ${idx}:`, error);
            }
        });

        console.log(`[processVideoService] Audio extraction complete: ${extractedAudioTracks.length} tracks`);

        // Step 3: Extract and convert subtitles to VTT
        const extractedSubtitleTracks: SubtitleTrackInfo[] = [];

        if (subtitleStreams.length > 0) {
            console.log(`[processVideoService] Extracting ${subtitleStreams.length} subtitle streams`);
        }

        subtitleStreams.forEach((s, idx) => {
            const lang = s.tags?.language ?? 'und';
            const title = s.tags?.title;

            // Output path: .v2-{fileName}/subtitles/{index}.vtt
            const outputSub = path.join(subtitleDir, `${idx}.vtt`);

            // Check if subtitle is a graphic format (cannot convert to text-based VTT)
            const graphicSubtitleCodecs = [
                'hdmv_pgs_subtitle', // Blu-ray PGS
                'dvd_subtitle', // DVD VobSub
                'dvdsub', // DVD subtitles
                'pgssub', // PGS alternative name
            ];

            if (graphicSubtitleCodecs.includes(s.codec_name)) {
                console.warn(
                    `[processVideoService] ⚠️  Skipping subtitle ${idx} (${lang}): Graphic format "${s.codec_name}" cannot be converted to VTT (text-based). Consider using OCR tools separately if needed.`
                );
                return; // Skip this subtitle
            }

            // Warn about potential style loss for advanced formats
            if (s.codec_name === 'ass' || s.codec_name === 'ssa') {
                console.log(
                    `[processVideoService] ℹ️  Converting ASS/SSA subtitle ${idx} (${lang}): Advanced styling, positioning, and animations will be lost in VTT conversion.`
                );
            }

            try {
                // Convert subtitle to WebVTT format
                // Using -c:s webvtt ensures proper conversion from various subtitle formats
                const subtitleCmd = `ffmpeg -y -i "${inputPath}" -map 0:${s.index} -c:s webvtt "${outputSub}"`;
                console.log(`[processVideoService] Extracting subtitle ${idx} (${lang}):`, subtitleCmd);
                execSync(subtitleCmd, { stdio: 'inherit' });

                // Verify the output file was created and has content
                if (fs.existsSync(outputSub) && fs.statSync(outputSub).size > 0) {
                    extractedSubtitleTracks.push({
                        index: idx,
                        path: outputSub,
                        language: lang,
                        title: title || undefined,
                    });
                    console.log(`[processVideoService] ✓ Successfully extracted subtitle ${idx} (${lang})`);
                } else {
                    console.error(
                        `[processVideoService] Failed to extract subtitle ${idx} (${lang}): Output file is empty or was not created`
                    );
                }
            } catch (subError) {
                console.error(`[processVideoService] Failed to extract subtitle ${idx} (${lang}):`, subError);
                // Continue processing other subtitles even if one fails
            }
        });

        console.log('[processVideoService] Processing complete!');
        console.log(`[processVideoService] Original video: ${inputPath} (unchanged)`);
        console.log(`[processVideoService] Extracted ${extractedAudioTracks.length} audio tracks`);
        console.log(`[processVideoService] Extracted ${extractedSubtitleTracks.length} subtitle tracks`);

        return {
            success: true,
            originalVideo: inputPath,
            audioTracks: extractedAudioTracks,
            subtitleTracks: extractedSubtitleTracks,
            audioPath: audioDir,
            subtitlesPath: subtitleDir,
        };
    } catch (error) {
        console.error('[processVideoService] Error processing video:', error);
        return {
            success: false,
            originalVideo: inputPath,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

// Example usage:
// const result = processVideoService("/path/to/movie.mkv");
// if (result.success) {
//   console.log("Original video:", result.originalVideo);
//   console.log("Audio tracks:", result.audioTracks);
//   console.log("Subtitle tracks:", result.subtitleTracks);
// } else {
//   console.error("Processing failed:", result.error);
// }
