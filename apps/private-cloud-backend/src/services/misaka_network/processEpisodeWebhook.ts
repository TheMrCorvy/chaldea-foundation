import type { ProcessEpisodeParams } from './index';
import { processVideoFile } from '../ffmpeg.service';
import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';

const processEpisodeWebhook = async ({ entry }: ProcessEpisodeParams): Promise<void> => {
    const apiKey = process.env.STRAPI_API_KEY;

    if (!apiKey) {
        throw new Error('STRAPI_API_KEY is not set');
    }

    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    if (entry.version === 'V1') {
        logData({
            title: `Episode ${entry.display_name} is V1, no processing needed`,
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

    logData({
        title: `Processing V2 episode: ${entry.display_name}`,
        data: { filePath },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    const metadata = await processVideoFile(filePath);

    await platformService.call('bEpisodePutBEpisodesById', {
        body: {
            data: {
                languages_info: metadata,
                is_processing: false,
            },
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
