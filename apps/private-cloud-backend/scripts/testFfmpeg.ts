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

import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import { processVideoFile } from '../src/services/ffmpegService';

dotenv.config();

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

processVideoFile(inputPath);
