import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class MediumProvider implements WuphfProvider {
    readonly network = SocialNetworks.MEDIUM;

    async post(_content: WuphfPostContent): Promise<void> {
        throw new Error('MediumProvider.post — not yet implemented');
    }
}
