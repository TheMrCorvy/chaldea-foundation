import PlatformService from '@repo/platform-service-sdk';
import { VerifyEpisodeExistance } from '../../types/dbInit';

const verifyEpisodeExistance: VerifyEpisodeExistance = async ({ parentId, episode }) => {
    const platformService = new PlatformService();
    const episodeAlreadyExists = await platformService.call('bEpisodeGetBEpisodes', {
        query: {
            filters: {
                display_name: {
                    $eq: episode.display_name,
                },
                parent_directory: {
                    documentId: parentId,
                },
            },
        },
    });

    if (episodeAlreadyExists.error || !episodeAlreadyExists.data.data) {
        return {
            error: {
                strapiError: episodeAlreadyExists.error,
                strapiResponse: episodeAlreadyExists,
            },
        };
    }

    if (episodeAlreadyExists.data.data.length === 0) {
        return {
            exists: false,
        };
    }

    const existingEpisode = episodeAlreadyExists.data.data[0];

    if (existingEpisode.version === episode.version && existingEpisode.display_name === episode.display_name) {
        return {
            exists: true,
            differs: false,
            existingEpisode,
        };
    }

    return {
        exists: true,
        differs: true,
        existingEpisode,
    };
};

export default verifyEpisodeExistance;
