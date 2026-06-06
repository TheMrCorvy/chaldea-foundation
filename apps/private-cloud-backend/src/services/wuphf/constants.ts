import { SocialNetworks, WuphfProvider } from './types';
import { LinkedInProvider } from './provders/LinkedIn.provider';
import { MediumProvider } from './provders/Medium.provider';
import { DevToProvider } from './provders/DevTo.provider';

export const AVAILABLE_PROVIDERS: Record<SocialNetworks, WuphfProvider> = {
    [SocialNetworks.LINKEDIN]: new LinkedInProvider(),
    [SocialNetworks.MEDIUM]: new MediumProvider(),
    [SocialNetworks.DEV_TO]: new DevToProvider(),
};
