// ─────────────────────────────────────────────────────────────────────────────
// Generic entry webhook payload shape
// ─────────────────────────────────────────────────────────────────────────────

import { Directory, Episode } from '@repo/type-definitions';
import { ImageComponent } from '@repo/type-definitions/dynamic-page';

export interface StrapiWebhookPayload {
    event: StrapiEventName;
    createdAt: string;
    publishedAt?: string | null;
    model: ModelNames;
    uid: string;
    entry: SocialMediaEntry | Episode | Directory;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event names
// ─────────────────────────────────────────────────────────────────────────────

export enum StrapiEventName {
    CREATE_ENTRY = 'entry.create',
    UPDATE_ENTRY = 'entry.update',
    DELETE_ENTRY = 'entry.delete',
    PUBLISH_ENTRY = 'entry.publish',
    UNPUBLISH_ENTRY = 'entry.unpublish',
    CREATE_MEDIA = 'media.create',
    UPDATE_MEDIA = 'media.update',
    DELETE_MEDIA = 'media.delete',
    PUBLISH_MEDIA = 'media.publish',
    UNPUBLISH_MEDIA = 'media.unpublish',
}

// ─────────────────────────────────────────────────────────────────────────────
// Model names
// ─────────────────────────────────────────────────────────────────────────────

export enum ModelNames {
    SOCIAL_MEDIA_POST = 'a-social-media-post',
    B_EPISODE = 'b-episode',
    B_DIRECTORY = 'b-directory',
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared entry base
// ─────────────────────────────────────────────────────────────────────────────

export interface StrapiEntryBase {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Entries content
// ─────────────────────────────────────────────────────────────────────────────

export interface SocialMediaEntry {
    title: string;
    body: string;
    video: Video | null;
    cover_image: ImageComponent | null;
    hasgtags: Hasgtag[] | null;
    post_on_platform: 'LinkedIn' | 'Dev.to' | 'All';
}

export interface Video extends StrapiEntryBase {
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
}

export interface Hasgtag {
    title: string;
    popover: string | null;
    icon: Icon | null;
}

export interface Icon {
    name: string;
}
