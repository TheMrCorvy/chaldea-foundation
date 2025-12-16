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
        console.log(`\nOriginal Video: ${result.originalVideo}`);

        if (result.audioTracks && result.audioTracks.length > 0) {
            console.log(`\nAudio Directory: ${result.audioPath}`);
            console.log(`Extracted ${result.audioTracks.length} audio track(s):`);
            result.audioTracks.forEach(track => {
                console.log(`  [${track.index}] ${track.language} - ${track.channels}ch @ ${track.sampleRate}Hz`);
                console.log(`      ${path.basename(track.path)}`);
                if (track.title) {
                    console.log(`      Title: ${track.title}`);
                }
            });
        } else {
            console.log('\nNo audio tracks found in the video.');
        }

        if (result.subtitleTracks && result.subtitleTracks.length > 0) {
            console.log(`\nSubtitles Directory: ${result.subtitlesPath}`);
            console.log(`Extracted ${result.subtitleTracks.length} subtitle(s):`);
            result.subtitleTracks.forEach(sub => {
                console.log(`  [${sub.index}] ${sub.language} - ${path.basename(sub.path)}`);
                if (sub.title) {
                    console.log(`      Title: ${sub.title}`);
                }
            });
        } else {
            console.log('\nNo subtitles found in the video.');
        }

        console.log('\n✨ Your files are now ready for MSE streaming!');
        process.exit(0);
    } else {
        console.error('❌ FAILED!');
        console.error(`\nError: ${result.error}`);
        process.exit(1);
    }
}

// Run the script
main();
