import PlatformService from '@repo/platform-service-sdk';
import type { ResolvedTag } from './types';
import { logData } from '@salvatore.hakase/log-data';
import { determineAgeRating } from './processChildDirectories';
import { Directory } from '@repo/type-definitions';

interface FinalizeDirectoryParams {
    entry: Directory;
    description: string | undefined;
    coverId: string | undefined;
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
    const updateData: Record<string, string | boolean | string[]> = {
        age_rating: determineAgeRating(entry.display_name),
        is_processing: false,
    };

    if (description !== undefined) {
        updateData.description = description;
    }

    if (coverId !== undefined) {
        updateData.cover = coverId;
    }

    if (tagIds.length > 0) {
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
