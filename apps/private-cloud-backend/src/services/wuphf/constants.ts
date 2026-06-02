import { SocialNetworks, WuphfProvider } from './types';
import { InstagramProvider } from './provders/Instagram.provider';
import { LinkedInProvider } from './provders/LinkedIn.provider';
import { RedditProvider } from './provders/Reddit.provider';
import { TwitterProvider } from './provders/Twitter.provider';

export const AVAILABLE_PROVIDERS: Record<SocialNetworks, WuphfProvider> = {
    [SocialNetworks.LINKEDIN]: new LinkedInProvider(),
    [SocialNetworks.INSTAGRAM]: new InstagramProvider(),
    [SocialNetworks.REDDIT]: new RedditProvider(),
    [SocialNetworks.TWITTER]: new TwitterProvider(),
};
