import type { SocialMediaEntry } from '../../types/strapiWebhook.types';
import { AVAILABLE_PROVIDERS } from './constants';
import { SocialNetworks, WuphfPostContent, WuphfProvider } from './types';

export function toWuphfPostContent(entry: SocialMediaEntry): WuphfPostContent {
    return {
        title: entry.title,
        body: entry.body,
        hashtags: entry.hasgtags ?? [],
        videoUrl: entry.video?.url ?? null,
        coverImageUrl: entry.cover_image?.url ?? null,
    };
}

export class Wuphf {
    private providers: Map<SocialNetworks, WuphfProvider>;

    constructor(providers: Partial<Record<SocialNetworks, WuphfProvider>> = {}) {
        this.providers = new Map(
            Object.values(SocialNetworks).map(network => [network, providers[network] ?? AVAILABLE_PROVIDERS[network]])
        );
    }

    /**
     * Post content to one or more social networks simultaneously.
     * Settled results are returned so a single failure does not abort the others.
     */
    async post(
        networks: SocialNetworks | SocialNetworks[],
        content: WuphfPostContent
    ): Promise<PromiseSettledResult<void>[]> {
        const targets = Array.isArray(networks) ? networks : [networks];

        return Promise.allSettled(
            targets.map(network => {
                const provider = this.providers.get(network);
                if (!provider) {
                    return Promise.reject(new Error(`No provider registered for network: ${network}`));
                }
                return provider.post(content);
            })
        );
    }
}
