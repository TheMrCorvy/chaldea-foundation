import { AdultContentType } from '@repo/type-definitions';

export interface LocalDirectory {
    display_name: string;
    directory_path: string;
    age_rating: AdultContentType;
    parent_directory: string | null;
    sub_directories: string[];
    episodes: LocalEpisode[];
    reasonOfFailure?: string;
}

export interface LocalEpisode {
    display_name: string;
    file_type: string;
    parent_directory: string;
    version: 'V1' | 'V2';
}

export interface DirectoryResponseStrapi {
    id: number;
    display_name: string;
    directory_path: string;
    createdAt: Date;
    updatedAt: Date;
    age_rating: AdultContentType;
    documentId: string;
    locale: null | string;
    publishedAt: Date | null;
    parent_directory?: number;
    sub_directories?: number[];
    anime_episodes?: number[];
}

export interface AnimeEpisodeResponseStrapi {
    id: number;
    display_name: string;
    file_path: string;
    createdAt: Date;
    updatedAt: Date;
    documentId: string;
    locale: string | null;
    publishedAt: Date | null;
    parent_directory?: number;
}
