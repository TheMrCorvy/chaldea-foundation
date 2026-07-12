import processEpisodeWebhook from './processEpisodeWebhook';
import processDirectoryWebhook from './processDirectoryWebhook';
import { Directory, Episode } from '@repo/type-definitions';

export interface ProcessEpisodeParams {
    entry: Episode;
}

export interface ProcessDirectoryParams {
    entry: Directory;
}

export class MisakaNetwork {
    async processEpisode(params: ProcessEpisodeParams): Promise<void> {
        await processEpisodeWebhook(params);
    }

    async processDirectory(params: ProcessDirectoryParams): Promise<void> {
        await processDirectoryWebhook(params);
    }
}
