import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class DevToProvider implements WuphfProvider {
    readonly network = SocialNetworks.DEV_TO;

    async post(_content: WuphfPostContent): Promise<void> {
        throw new Error('DevToProvider.post — not yet implemented');
    }
}
