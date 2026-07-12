import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';
import { LocalEpisode } from '../../../utils/typesDefinition';
import { Directory } from '@repo/type-definitions';

export interface ProcessEpisodesInDirectoryParams {
    episodes?: LocalEpisode[];
    directory: Directory;
    platformService: PlatformService;
}

export const processEpisodesInDirectory = async (params: ProcessEpisodesInDirectoryParams): Promise<void> => {
    const { episodes, directory, platformService } = params;

    if (!episodes || episodes.length === 0) {
        logData({
            title: `No episodes found in directory: ${directory.display_name}`,
            layer: 'queue_jobs',
            type: 'info',
            addSpaceAfter: true,
            timeStamp: true,
            addSeparatorAfter: true,
        });
        return;
    }

    logData({
        title: `Processing ${episodes.length} episodes in directory: ${directory.display_name}`,
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    for (const episode of episodes) {
        const existing = await platformService.call('bEpisodeGetBEpisodes', {
            query: {
                filters: {
                    display_name: { $eq: episode.display_name },
                    file_type: { $eq: episode.file_type },
                    parent_directory: { documentId: directory.documentId },
                },
            },
        });

        if (existing.data?.data && existing.data.data.length > 0) {
            logData({
                title: `Episode already exists, skipping: ${episode.display_name}`,
                layer: 'queue_jobs',
                type: 'info',
                addSpaceAfter: true,
                timeStamp: true,
                addSeparatorAfter: true,
            });
            continue;
        }

        await platformService.call('bEpisodePostBEpisodes', {
            body: {
                data: {
                    display_name: episode.display_name,
                    file_type: episode.file_type,
                    version: episode.version,
                    parent_directory: directory.documentId,
                    is_processing: episode.version === 'V2',
                },
            },
        });

        logData({
            title: `Created episode: ${episode.display_name}`,
            data: { version: episode.version, file_type: episode.file_type },
            layer: 'queue_jobs',
            type: 'info',
            addSpaceAfter: true,
            timeStamp: true,
            addSeparatorAfter: true,
        });
    }
};
