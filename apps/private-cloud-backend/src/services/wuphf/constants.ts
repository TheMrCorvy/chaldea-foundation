import { SocialNetworks, WuphfProvider } from './types';
import { LinkedInProvider } from './provders/LinkedIn.provider';
import { DevToProvider } from './provders/DevTo.provider';

export const AVAILABLE_PROVIDERS: Record<SocialNetworks, WuphfProvider> = {
    [SocialNetworks.LINKEDIN]: new LinkedInProvider(),
    [SocialNetworks.DEV_TO]: new DevToProvider(),
};
