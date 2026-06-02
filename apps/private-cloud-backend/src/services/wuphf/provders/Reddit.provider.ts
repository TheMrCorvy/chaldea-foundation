import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class RedditProvider implements WuphfProvider {
    readonly network = SocialNetworks.REDDIT;

    async post(_content: WuphfPostContent): Promise<void> {
        throw new Error('RedditProvider.post — not yet implemented');
    }
}
