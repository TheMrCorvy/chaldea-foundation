import PlatformService from '@repo/platform-service-sdk';
import { VerifyDirectoryExistance } from '../../types/dbInit';
import { logData } from '@repo/shared-utils/log-data';

const verifyDirectoryExistance: VerifyDirectoryExistance = async ({
    directory,
    failedDirectories,
    skippedDirectories,
}) => {
    const platformService = new PlatformService();

    const directoryAlreadyExists = await platformService.call('bDirectoryGetBDirectories', {
        query: {
            filters: {
                path: {
                    $eq: directory.directory_path,
                },
            },
        },
    });

    if (directoryAlreadyExists.error || !directoryAlreadyExists.data.data) {
        failedDirectories.push({ ...directory, error: directoryAlreadyExists });
        logData({
            layer: '*',
            title: `Error checking if directory exists in strapi`,
            data: directoryAlreadyExists.error,
            addSpaceAfter: true,
        });

        return {
            error: {
                strapiError: directoryAlreadyExists.error,
                strapiResponse: directoryAlreadyExists.data,
            },
            failed: true,
            skipped: false,
        };
    }

    if (directoryAlreadyExists.data.data.length > 0) {
        skippedDirectories.push(directory);

        logData({
            layer: '*',
            title: 'Directory already exists in strapi, skipping...',
            addSpaceAfter: true,
        });

        return {
            skipped: true,
            failed: false,
            directory: directoryAlreadyExists.data.data,
        };
    }
    return {
        skipped: false,
        failed: false,
        directory: directoryAlreadyExists.data.data,
    };
};

export default verifyDirectoryExistance;
