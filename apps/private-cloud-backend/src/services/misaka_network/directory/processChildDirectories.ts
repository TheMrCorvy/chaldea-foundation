import PlatformService from '@repo/platform-service-sdk';
import type { StrapiDirectoryListItem } from './types';
import { logData } from '@salvatore.hakase/log-data';
import { AdultContentType, Directory } from '@repo/type-definitions';

export const determineAgeRating = (displayName: string): AdultContentType => {
    if (displayName.startsWith('! ')) return 'adults';
    if (displayName.startsWith('* ')) return 'explicit';
    return 'everyone';
};

export interface CreateChildrenDirectoryParams {
    childName: string;
    childPath: string;
    parentDirectory: Directory;
    platformService: PlatformService;
}

const createChildDirectory = async (params: CreateChildrenDirectoryParams): Promise<void> => {
    const { childName, childPath, parentDirectory, platformService } = params;

    await platformService.call('bDirectoryPostBDirectories', {
        body: {
            data: {
                display_name: childName,
                path: childPath,
                age_rating: determineAgeRating(childName),
                parent_directory: parentDirectory.documentId,
                is_processing: true,
            },
        },
    });

    logData({
        title: `Created child directory: ${childName}`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
    });
};

export interface UpdateChildDirectoryParentParams {
    existingDir: StrapiDirectoryListItem;
    parentDirectory: Directory;
    platformService: PlatformService;
}

const updateChildDirectoryParent = async (params: UpdateChildDirectoryParentParams): Promise<void> => {
    const { existingDir, parentDirectory, platformService } = params;

    await platformService.call('bDirectoryPutBDirectoriesById', {
        body: {
            data: {
                parent_directory: parentDirectory.documentId,
                is_processing: true,
            },
        },
        path: { id: existingDir.documentId },
    });

    logData({
        title: `Updated child directory parent`,
        data: { documentId: existingDir.documentId },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
    });
};

export interface ProcessChildDirectoriesParams {
    childNames: string[];
    parentDirectory: Directory;
    platformService: PlatformService;
}

export const processChildDirectories = async (params: ProcessChildDirectoriesParams): Promise<void> => {
    const { childNames, parentDirectory, platformService } = params;

    for (const childName of childNames) {
        const childPath = `${parentDirectory.path}/${childName}`;

        const existing = await platformService.call('bDirectoryGetBDirectories', {
            query: {
                filters: {
                    path: {
                        $eq: childPath,
                    },
                },
            },
        });

        const items = existing.data?.data as StrapiDirectoryListItem[] | undefined;

        if (items && items.length > 0) {
            const existingDir = items[0];
            const hasCorrectParent = existingDir.parent_directory?.documentId === parentDirectory.documentId;

            if (!hasCorrectParent) {
                await updateChildDirectoryParent({ existingDir, parentDirectory, platformService });
            }
            continue;
        }

        await createChildDirectory({ childName, childPath, parentDirectory, platformService });
    }
};
