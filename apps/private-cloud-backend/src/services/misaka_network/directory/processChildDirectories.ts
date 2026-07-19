import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';
import { Directory } from '@repo/type-definitions';
import { cleanName, determineAgeRating } from './namePrefixes';

export interface CreateChildrenDirectoryParams {
    childName: string;
    childPath: string;
    parentDirectory: Directory;
    platformService: PlatformService;
}

const createChildDirectory = async (params: CreateChildrenDirectoryParams): Promise<void> => {
    const { childName, childPath, parentDirectory, platformService } = params;

    const cleanChildName = cleanName(childName);

    await platformService.call('bDirectoryPostBDirectories', {
        body: {
            data: {
                display_name: cleanChildName,
                path: childPath,
                age_rating: determineAgeRating(childName),
                parent_directory: parentDirectory.documentId,
                is_processing: true,
            },
        },
    });

    logData({
        title: `Created child directory: ${cleanChildName}`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
    });
};

export interface UpdateChildDirectoryParams {
    existingDir: Directory;
    parentDirectory: Directory;
    platformService: PlatformService;
    is_processing: boolean;
}

const updateChildDirectory = async (params: UpdateChildDirectoryParams): Promise<void> => {
    const { existingDir, parentDirectory, platformService, is_processing } = params;

    await platformService.call('bDirectoryPutBDirectoriesById', {
        body: {
            data: {
                parent_directory: parentDirectory.documentId,
                is_processing: is_processing,
            },
        },
        path: { id: existingDir.documentId },
    });

    logData({
        title: `Updated child directory: ${existingDir.display_name}`,
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

    logData({
        title: `Processing child directories for parent ${parentDirectory.display_name}`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });

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

        const items = existing.data?.data as Directory[] | undefined;

        logData({
            title: `Checking for existing child directory: ${childPath}`,
            data: { existing: items },
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });

        if (items && items.length > 0) {
            const existingDir = items[0];
            const hasCorrectParent = existingDir.parent_directory?.documentId === parentDirectory.documentId;
            const hasIncorrectProcessingState =
                existingDir.is_processing === undefined || existingDir.is_processing === null;

            if (!hasCorrectParent || hasIncorrectProcessingState) {
                await updateChildDirectory({
                    existingDir,
                    parentDirectory,
                    platformService,
                    is_processing: hasIncorrectProcessingState ? false : true,
                });
            }

            continue;
        }

        await createChildDirectory({ childName, childPath, parentDirectory, platformService });
    }
};
