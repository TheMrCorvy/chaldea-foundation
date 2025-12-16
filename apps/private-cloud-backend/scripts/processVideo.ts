#!/usr/bin/env ts-node

/**
 * Script to process video files for MSE streaming
 *
 * Usage:
 *   npm run process-video /path/to/video.mkv
 *   ts-node scripts/processVideo.ts /path/to/video.mkv
 *
 * This will:
 * 1. Keep the original video file intact
 * 2. Extract audio tracks to .v2-{fileName}/audio/0.m4a, 1.m4a, etc.
 * 3. Extract subtitles to .v2-{fileName}/subtitles/0.vtt, 1.vtt, etc.
 */

import { processVideoService } from '../src/services/processVideoService';
import * as path from 'path';
import * as fs from 'fs';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Error: No input file specified');
    console.log('');
    console.log('Usage:');
    console.log('  npm run process-video <input-file>');
    console.log('  ts-node scripts/processVideo.ts <input-file>');
    console.log('');
    console.log('Example:');
    console.log('  npm run process-video /path/to/video.mkv');
    console.log('');
    process.exit(1);
}

const inputPath = path.resolve(args[0]);

if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file does not exist: ${inputPath}`);
    process.exit(1);
}

console.log('='.repeat(80));
console.log('MSE Video Processor');
console.log('='.repeat(80));
console.log(`Input: ${inputPath}`);
console.log('');

const result = processVideoService(inputPath);

console.log('');
console.log('='.repeat(80));
console.log('Processing Result');
console.log('='.repeat(80));

if (result.success) {
    console.log('✓ Processing completed successfully');
    console.log('');
    console.log(`Original video: ${result.originalVideo}`);
    console.log('');

    if (result.audioTracks && result.audioTracks.length > 0) {
        console.log(`Audio tracks (${result.audioTracks.length}):`);
        result.audioTracks.forEach(track => {
            console.log(`  [${track.index}] ${track.language} - ${track.channels}ch @ ${track.sampleRate}Hz`);
            console.log(`      Path: ${track.path}`);
            if (track.title) {
                console.log(`      Title: ${track.title}`);
            }
        });
        console.log('');
    }

    if (result.subtitleTracks && result.subtitleTracks.length > 0) {
        console.log(`Subtitle tracks (${result.subtitleTracks.length}):`);
        result.subtitleTracks.forEach(track => {
            console.log(`  [${track.index}] ${track.language}`);
            console.log(`      Path: ${track.path}`);
            if (track.title) {
                console.log(`      Title: ${track.title}`);
            }
        });
        console.log('');
    }

    console.log('Output directories:');
    if (result.audioPath) {
        console.log(`  Audio: ${result.audioPath}`);
    }
    if (result.subtitlesPath) {
        console.log(`  Subtitles: ${result.subtitlesPath}`);
    }

    console.log('');
    console.log('✓ Files are ready for MSE streaming');
} else {
    console.error('✗ Processing failed');
    console.error(`Error: ${result.error}`);
    process.exit(1);
}

console.log('='.repeat(80));
