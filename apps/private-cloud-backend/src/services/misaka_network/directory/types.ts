import { LocalEpisode } from '../../../utils/typesDefinition';

export interface DirectoryMetadata {
    description: string;
    tags: string[];
}

export interface DiskScanResult {
    episodes: LocalEpisode[];
    hasCover: boolean;
    metadata: DirectoryMetadata | null;
    childDirectories: string[];
}

export interface ResolvedTag {
    documentId: string;
}
