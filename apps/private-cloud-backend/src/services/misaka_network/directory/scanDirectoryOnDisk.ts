import { promises as fs } from 'fs';
import path from 'path';
import type { DirectoryMetadata, DiskScanResult } from './types';
import { LocalEpisode } from '../../../utils/typesDefinition';

const V1_EXTENSIONS = new Set(['mp4']);
const V2_EXTENSIONS = new Set(['mkv', 'avi', 'mov', 'wmv', 'flv', 'webm']);

function getEpisodeVersion(ext: string): 'V1' | 'V2' | null {
    const lower = ext.toLowerCase();

    if (V1_EXTENSIONS.has(lower)) return 'V1';
    if (V2_EXTENSIONS.has(lower)) return 'V2';

    return null;
}

export const scanDirectoryOnDisk = async (parentDirectoryPath: string): Promise<DiskScanResult> => {
    const entries = await fs.readdir(parentDirectoryPath, { withFileTypes: true });
    const episodes: LocalEpisode[] = [];
    let hasCover = false;
    let metadata: DirectoryMetadata | null = null;
    const childDirectories: string[] = [];

    for (const dirEntry of entries) {
        if (dirEntry.isDirectory()) {
            childDirectories.push(dirEntry.name);
            continue;
        }

        if (dirEntry.name === 'cover.jpg') {
            hasCover = true;
            continue;
        }

        if (dirEntry.name === 'metadata.json') {
            const raw = await fs.readFile(path.join(parentDirectoryPath, 'metadata.json'), 'utf-8');
            metadata = JSON.parse(raw) as DirectoryMetadata;
            continue;
        }

        const ext = path.extname(dirEntry.name).slice(1);
        const version = getEpisodeVersion(ext);

        if (version) {
            const nameWithoutExt = path.basename(dirEntry.name, `.${ext}`);
            episodes.push({
                display_name: nameWithoutExt,
                file_type: ext,
                version,
                parent_directory: parentDirectoryPath,
            });
        }
    }

    return { episodes, hasCover, metadata, childDirectories };
};
