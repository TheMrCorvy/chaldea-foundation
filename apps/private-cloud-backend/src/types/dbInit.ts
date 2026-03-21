import { Episode } from '@repo/type-definitions';
import { LocalDirectory, LocalEpisode } from '../utils/typesDefinition';

export interface RequestError {
    strapiError: unknown;
    strapiResponse: unknown;
}

export interface UpdateEpisodeInStrapiParams {
    metadata: object | null;
    episode: LocalEpisode;
    existingEpisodeId: string;
}

export interface UpdateEpisodeInStrapiResult {
    error?: RequestError;
}

export type UpdateEpisodeInStrapi = (params: UpdateEpisodeInStrapiParams) => Promise<UpdateEpisodeInStrapiResult>;

export interface VerifyEpisodeExistanceResult {
    exists?: boolean;
    differs?: boolean;
    error?: object;
    existingEpisode?: Episode;
}

export interface VerifyEpisodeExistanceParams {
    parentId: string;
    episode: LocalEpisode;
}

export type VerifyEpisodeExistance = (params: VerifyEpisodeExistanceParams) => Promise<VerifyEpisodeExistanceResult>;

export interface VerifyDirectoryExistanceResult {
    error?: object;
    exists?: boolean;
    differs?: boolean;
}

export interface VerifyDirectoryExistanceParams {
    directory: LocalDirectory;
}

export type VerifyDirectoryExistance = (params: VerifyDirectoryExistance) => Promise<VerifyDirectoryExistanceResult>;
