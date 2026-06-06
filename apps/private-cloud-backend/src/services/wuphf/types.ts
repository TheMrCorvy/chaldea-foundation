import type { Hasgtag } from '../../types/strapiWebhook.types';

export enum SocialNetworks {
    LINKEDIN = 'linkedin',
    MEDIUM = 'medium',
    DEV_TO = 'devto',
}

export interface WuphfPostContent {
    title: string;
    body: string;
    hashtags: Hasgtag[];
    videoUrl: string | null;
    coverImageUrl: string | null;
}

export interface WuphfProvider {
    readonly network: SocialNetworks;
    post(content: WuphfPostContent): Promise<void>;
}
