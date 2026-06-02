import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class TwitterProvider implements WuphfProvider {
    readonly network = SocialNetworks.TWITTER;

    async post(_content: WuphfPostContent): Promise<void> {
        throw new Error('TwitterProvider.post — not yet implemented');
    }
}
