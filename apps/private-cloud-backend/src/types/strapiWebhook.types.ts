// ─────────────────────────────────────────────────────────────────────────────
// Generic entry webhook payload shape
// ─────────────────────────────────────────────────────────────────────────────

export interface StrapiWebhookPayload {
    event: StrapiEventName;
    createdAt: string;
    publishedAt?: string | null;
    model: ModelNames;
    uid: string;
    entry: SocialMediaEntry;
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
    cover_image: CoverImage | null;
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

export interface CoverImage extends StrapiEntryBase {
    width: number;
    height: number;
    formats: Formats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
}

export interface Formats {
    thumbnail: Thumbnail;
    small: Small;
}

export interface Thumbnail {
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    sizeInBytes: number;
    url: string;
}

export interface Small {
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    sizeInBytes: number;
    url: string;
}

export interface Hasgtag {
    title: string;
    popover: string | null;
    icon: Icon | null;
}

export interface Icon {
    name: string;
}
