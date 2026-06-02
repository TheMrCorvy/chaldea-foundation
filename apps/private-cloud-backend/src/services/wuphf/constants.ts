import { SocialNetwork, WuphfProvider } from '.';
import { InstagramProvider } from './provders/Instagram.provider';
import { LinkedInProvider } from './provders/LinkedIn.provider';
import { RedditProvider } from './provders/Reddit.provider';
import { TwitterProvider } from './provders/Twitter.provider';

export const AVAILABLE_PROVIDERS: Record<SocialNetwork, WuphfProvider> = {
    [SocialNetwork.LINKEDIN]: new LinkedInProvider(),
    [SocialNetwork.INSTAGRAM]: new InstagramProvider(),
    [SocialNetwork.REDDIT]: new RedditProvider(),
    [SocialNetwork.TWITTER]: new TwitterProvider(),
};
