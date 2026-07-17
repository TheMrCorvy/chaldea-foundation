import PlatformService from '@repo/platform-service-sdk';
import type { ResolvedTag } from './types';
import { logData } from '@salvatore.hakase/log-data';
import { determineAgeRating } from './namePrefixes';
import { Directory } from '@repo/type-definitions';
import { cleanName } from './namePrefixes';

interface FinalizeDirectoryParams {
    entry: Directory;
    description: string | undefined;
    coverId: number | undefined;
    tagIds: ResolvedTag[];
    platformService: PlatformService;
}

export const finalizeDirectory = async ({
    entry,
    description,
    coverId,
    tagIds,
    platformService,
}: FinalizeDirectoryParams): Promise<void> => {
    const segments = entry.path.split('/').filter(Boolean);
    let folderNameOnDisk = '';
    const popped = segments.pop();

    if (popped) {
        folderNameOnDisk = popped;
    }

    const cleanDisplayName = cleanName(folderNameOnDisk);
    const ageRating = determineAgeRating(folderNameOnDisk);

    const updateData: Record<string, string | number | boolean | string[]> = {
        display_name: cleanDisplayName,
        age_rating: ageRating,
        is_processing: false,
    };

    if (description) {
        updateData.description = description;
    }

    if (coverId) {
        updateData.cover = coverId;
    }

    if (tagIds && tagIds.length > 0) {
        updateData.tags = tagIds.map(t => t.documentId);
    }

    await platformService.call('bDirectoryPutBDirectoriesById', {
        body: { data: updateData },
        path: { id: entry.documentId },
    });

    logData({
        title: `Finalized directory: ${entry.display_name}`,
        data: { documentId: entry.documentId, age_rating: updateData.age_rating },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });
};
