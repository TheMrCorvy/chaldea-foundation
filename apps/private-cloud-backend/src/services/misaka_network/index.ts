import type { BEpisodeEntry, BDirectoryEntry } from '../../types/strapiWebhook.types';
import processEpisodeWebhook from './processEpisodeWebhook';
import processDirectoryWebhook from './processDirectoryWebhook';

export interface ProcessEpisodeParams {
    entry: BEpisodeEntry;
}

export interface ProcessDirectoryParams {
    entry: BDirectoryEntry;
}

export class MisakaNetwork {
    async processEpisode(params: ProcessEpisodeParams): Promise<void> {
        await processEpisodeWebhook(params);
    }

    async processDirectory(params: ProcessDirectoryParams): Promise<void> {
        await processDirectoryWebhook(params);
    }
}
