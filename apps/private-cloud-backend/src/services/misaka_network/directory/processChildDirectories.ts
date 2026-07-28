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

    const createdDirectory = await platformService.call('bDirectoryPostBDirectories', {
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
        data: { createdDirectory: createdDirectory.data },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });
};

export interface UpdateChildDirectoryParams {
    existingDir: Directory;
    parentDirectory: Directory;
    platformService: PlatformService;
    age_rating?: string;
    path: string;
}

const updateChildDirectory = async (params: UpdateChildDirectoryParams): Promise<void> => {
    const { existingDir, parentDirectory, platformService, age_rating, path } = params;

    const updatedDirectory = await platformService.call('bDirectoryPutBDirectoriesById', {
        body: {
            data: {
                parent_directory: parentDirectory.documentId,
                is_processing: true,
                age_rating: age_rating,
                path,
            },
        },
        path: { id: existingDir.documentId },
    });

    logData({
        title: `Updated child directory: ${existingDir.display_name}`,
        data: { updatedDirectory: updatedDirectory.data },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });
};

export interface ProcessChildDirectoriesParams {
    childNames: string[];
    parentDirectory: Directory;
    platformService: PlatformService;
    realParentDirPath: string;
}

export const processChildDirectories = async (params: ProcessChildDirectoriesParams): Promise<void> => {
    const { childNames, parentDirectory, platformService, realParentDirPath } = params;

    logData({
        title: `Processing child directories for parent ${parentDirectory.display_name}`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        data: params,
    });

    for (const childName of childNames) {
        const childPath = `${realParentDirPath}/${childName}`;
        const childAgeRating = determineAgeRating(childName);

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

            await updateChildDirectory({
                existingDir,
                parentDirectory,
                platformService,
                age_rating: childAgeRating,
                path: childPath,
            });

            continue;
        }

        await createChildDirectory({ childName, childPath, parentDirectory, platformService });
    }
};
