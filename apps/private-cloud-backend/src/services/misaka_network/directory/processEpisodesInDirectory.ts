import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';
import { LocalEpisode } from '../../../utils/typesDefinition';
import { Directory, Episode } from '@repo/type-definitions';

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
            timeStamp: true,
            data: params,
        });
        return;
    }

    logData({
        title: `Processing ${episodes.length} episodes in directory: ${directory.display_name}`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        data: params,
    });

    for (const localEpisode of episodes) {
        const existing = await platformService.call('bEpisodeGetBEpisodes', {
            query: {
                filters: {
                    display_name: { $eq: localEpisode.display_name },
                    file_type: { $eq: localEpisode.file_type },
                    parent_directory: { documentId: directory.documentId },
                },
            },
        });

        if (!existing || !existing.data || existing.data.data.length === 0) {
            const createdEpisode = await platformService.call('bEpisodePostBEpisodes', {
                body: {
                    data: {
                        display_name: localEpisode.display_name,
                        file_type: localEpisode.file_type,
                        version: localEpisode.version,
                        parent_directory: directory.documentId,
                        is_processing: localEpisode.version === 'V2',
                    },
                },
            });

            logData({
                title: `Created episode: ${localEpisode.display_name}`,
                data: { localEpisode, createdEpisode: createdEpisode.data },
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
            });

            continue;
        }

        const strapiEpisode = existing.data.data[0] as Episode;
        const hasIncorrectV2Metadata = strapiEpisode.version === 'V2' && strapiEpisode.languages_info === null;
        const hasIncorrectV1Metadata = strapiEpisode.version === 'V1' && strapiEpisode.languages_info !== null;

        if ((hasIncorrectV2Metadata || hasIncorrectV1Metadata) && !strapiEpisode.is_processing) {
            const updatedEpisode = await platformService.call('bEpisodePutBEpisodesById', {
                path: { id: strapiEpisode.documentId },
                body: {
                    data: {
                        is_processing: true,
                    },
                },
            });

            logData({
                title: `Updated existing episode to set is_processing to true: ${strapiEpisode.display_name}`,
                data: {
                    localEpisode,
                    updatedEpisode: updatedEpisode.data,
                    hasIncorrectV2Metadata,
                    hasIncorrectV1Metadata,
                },
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
            });

            continue;
        }

        if (strapiEpisode.is_processing === undefined || strapiEpisode.is_processing === null) {
            strapiEpisode.is_processing = false;

            const updatedEpisode = await platformService.call('bEpisodePutBEpisodesById', {
                path: { id: strapiEpisode.documentId },
                body: {
                    data: {
                        is_processing: false,
                    },
                },
            });

            logData({
                title: `Updated existing episode to set is_processing to false: ${strapiEpisode.display_name}`,
                data: {
                    localEpisode,
                    updatedEpisode: updatedEpisode.data,
                    hasIncorrectV2Metadata,
                    hasIncorrectV1Metadata,
                },
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
            });

            continue;
        }

        logData({
            title: `Episode already exists, skipping: ${strapiEpisode.display_name}`,
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            data: {
                localEpisode,
                existingEpisode: strapiEpisode,
                hasIncorrectV2Metadata,
                hasIncorrectV1Metadata,
            },
        });

        continue;
    }
};
