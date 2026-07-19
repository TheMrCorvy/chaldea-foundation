import type { ProcessEpisodeParams } from './index';
import { processVideoFile, VideoMetadata } from '../ffmpeg.service';
import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';
import fs from 'fs';

interface UpdatedBody {
    languages_info?: VideoMetadata | null;
    is_processing: boolean;
}

const processEpisodeWebhook = async ({ entry }: ProcessEpisodeParams): Promise<void> => {
    const apiKey = process.env.STRAPI_API_KEY;

    if (!apiKey) {
        throw new Error('STRAPI_API_KEY is not set');
    }

    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    const hasIncorrectV1Metadata = entry.version === 'V1' && entry.languages_info !== null;

    if ((entry.version === 'V1' && !hasIncorrectV1Metadata) || entry.is_processing === false) {
        logData({
            title: `Episode ${entry.display_name} is V1 or not processing, no processing needed`,
            layer: 'queue_jobs',
            type: 'info',
            addSpaceAfter: true,
            addSeparatorAfter: true,
            timeStamp: true,
        });

        return;
    }

    const secureBasePath = process.env.SECURE_BASE_PATH;

    if (!secureBasePath) {
        throw new Error('SECURE_BASE_PATH is not set');
    }

    const directoryPath = entry.parent_directory?.path ?? '';

    if (!directoryPath) {
        throw new Error(`Parent directory path is not set for episode ${entry.display_name}`);
    }

    const filePath = `${secureBasePath}${directoryPath}/${entry.display_name}.${entry.file_type}`;

    if (!fs.existsSync(filePath)) {
        logData({
            title: `Episode file does not exist on ${filePath}`,
            layer: '*',
            type: 'error',
            addSpaceAfter: true,
            addSeparatorAfter: true,
            timeStamp: true,
            data: entry,
        });

        throw new Error(`Episode file does not exist: ${filePath}`);
    }

    logData({
        title: `Processing episode: ${entry.display_name}`,
        data: entry,
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    const hasIncorrectV2Metadata = entry.languages_info === null && entry.version === 'V2';
    let metadata: VideoMetadata | null = null;
    let needToUpdateMetadata = false;

    if (hasIncorrectV2Metadata) {
        metadata = await processVideoFile(filePath);
        needToUpdateMetadata = true;
    }

    if (hasIncorrectV1Metadata) {
        metadata = null;
        needToUpdateMetadata = true;
    }

    const updatedBody: UpdatedBody = {
        is_processing: false,
    };

    if (needToUpdateMetadata) {
        updatedBody.languages_info = metadata;
    }

    await platformService.call('bEpisodePutBEpisodesById', {
        body: {
            data: updatedBody,
        },
        path: {
            id: entry.documentId,
        },
    });

    logData({
        title: `Finished processing episode: ${entry.display_name}`,
        data: { documentId: entry.documentId },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });
};

export default processEpisodeWebhook;
