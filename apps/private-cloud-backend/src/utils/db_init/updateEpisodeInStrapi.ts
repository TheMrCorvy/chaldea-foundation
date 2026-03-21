import PlatformService from '@repo/platform-service-sdk';
import { UpdateEpisodeInStrapi } from '../../types/dbInit';

const updateEpisodeInStrapi: UpdateEpisodeInStrapi = async ({ metadata, episode, existingEpisodeId }) => {
    const platformService = new PlatformService();
    const isVOne = episode.version === 'V1';
    const updatedEpisode = await platformService.call('bEpisodePutBEpisodesById', {
        body: {
            data: {
                version: episode.version || (isVOne ? 'V1' : 'V2'),
                languages_info: isVOne ? undefined : metadata,
                display_name: episode.display_name,
            },
        },
        path: {
            id: existingEpisodeId,
        },
    });

    if (updatedEpisode.error || !updatedEpisode.data.data) {
        return {
            error: {
                strapiError: updatedEpisode.error,
                strapiResponse: updatedEpisode.data,
            },
        };
    }

    return updatedEpisode;
};

export default updateEpisodeInStrapi;
