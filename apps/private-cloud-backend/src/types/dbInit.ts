import { Directory, Episode } from '@repo/type-definitions';
import { LocalDirectory, LocalEpisode } from '../utils/typesDefinition';
import PlatformService from '@repo/platform-service-sdk';

export interface RequestError {
    strapiError: unknown;
    strapiResponse: unknown;
}

export interface UpdateEpisodeInStrapiParams {
    metadata: object | null;
    episode: LocalEpisode;
    existingEpisodeId: string;
    platformService: PlatformService;
}

export interface UpdateEpisodeInStrapiResult {
    error?: RequestError;
}

export type UpdateEpisodeInStrapi = (params: UpdateEpisodeInStrapiParams) => Promise<UpdateEpisodeInStrapiResult>;

export interface VerifyEpisodeExistanceResult {
    exists?: boolean;
    differs?: boolean;
    error?: RequestError;
    existingEpisode?: Episode;
}

export interface VerifyEpisodeExistanceParams {
    parentId: string;
    episode: LocalEpisode;
    platformService: PlatformService;
}

export type VerifyEpisodeExistance = (params: VerifyEpisodeExistanceParams) => Promise<VerifyEpisodeExistanceResult>;

export interface VerifyDirectoryExistanceResult {
    error?: RequestError;
    exists?: boolean;
    directory?: Directory;
    skipped: boolean;
    failed: boolean;
}

export interface VerifyDirectoryExistanceParams {
    directory: LocalDirectory;
    failedDirectories: unknown[];
    skippedDirectories: unknown[];
    platformService: PlatformService;
}

export type VerifyDirectoryExistance = (
    params: VerifyDirectoryExistanceParams
) => Promise<VerifyDirectoryExistanceResult>;

export interface VerifyEnvResult {
    secureBasePath: string;
    initiumIter: string[];
    excludedParents: string[];
    strapiApiKey: string;
}
