import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class InstagramProvider implements WuphfProvider {
    readonly network = SocialNetworks.INSTAGRAM;

    async post(_content: WuphfPostContent): Promise<void> {
        throw new Error('InstagramProvider.post — not yet implemented');
    }
}
