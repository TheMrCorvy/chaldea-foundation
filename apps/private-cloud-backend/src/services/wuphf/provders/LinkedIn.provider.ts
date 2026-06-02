import { SocialNetworks, WuphfPostContent, WuphfProvider } from '../types';

export class LinkedInProvider implements WuphfProvider {
    readonly network = SocialNetworks.LINKEDIN;

    async post(_content: WuphfPostContent): Promise<void> {
        // TODO: implement LinkedIn API integration
        throw new Error('LinkedInProvider.post — not yet implemented');
    }
}
