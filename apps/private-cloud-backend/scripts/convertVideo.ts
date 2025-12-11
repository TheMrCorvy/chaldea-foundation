#!/usr/bin/env ts-node

import { processVideoService } from '../src/services/processVideoService';
import * as path from 'path';

function main(): void {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Error: No video file path provided');
        console.log('\nUsage: tsx src/scripts/convertVideo.ts <path-to-video-file>');
        console.log('Example: tsx src/scripts/convertVideo.ts /path/to/video.mkv');
        process.exit(1);
    }

    const inputPath = path.resolve(args[0]);

    console.log('='.repeat(60));
    console.log('Video Conversion Script');
    console.log('='.repeat(60));
    console.log(`Input file: ${inputPath}\n`);

    const startTime = Date.now();

    // Call the processing function
    const result = processVideoService(inputPath);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('Conversion Complete');
    console.log('='.repeat(60));
    console.log(`Duration: ${duration} seconds\n`);

    if (result.success) {
        console.log('✅ SUCCESS!');
        console.log(`\nProcessed Video: ${result.video}`);

        if (result.subtitles && result.subtitles.length > 0) {
            console.log(`\nSubtitles Directory: ${result.subtitlesPath}`);
            console.log(`Extracted ${result.subtitles.length} subtitle(s):`);
            result.subtitles.forEach((sub, idx) => {
                console.log(`  ${idx + 1}. [${sub.language}] ${path.basename(sub.path)}`);
            });
        } else {
            console.log('\nNo subtitles found in the video.');
        }

        console.log('\n✨ Your video is now ready for browser streaming!');
        process.exit(0);
    } else {
        console.error('❌ FAILED!');
        console.error(`\nError: ${result.error}`);
        process.exit(1);
    }
}

// Run the script
main();
