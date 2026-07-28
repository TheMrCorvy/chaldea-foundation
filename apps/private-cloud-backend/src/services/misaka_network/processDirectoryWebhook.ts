import type { ProcessDirectoryParams } from './index';
import { promises as fs } from 'fs';
import path from 'path';
import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@salvatore.hakase/log-data';
import { scanDirectoryOnDisk } from './directory/scanDirectoryOnDisk';
import { processEpisodesInDirectory } from './directory/processEpisodesInDirectory';
import { uploadDirectoryCover } from './directory/uploadDirectoryCover';
import { resolveDirectoryTags } from './directory/resolveDirectoryTags';
import { processChildDirectories } from './directory/processChildDirectories';
import { finalizeDirectory } from './directory/finalizeDirectory';

const processDirectoryWebhook = async ({ entry }: ProcessDirectoryParams): Promise<void> => {
    const apiKey = process.env.STRAPI_API_KEY;
    if (!apiKey) throw new Error('STRAPI_API_KEY is not set');

    const secureBasePath = process.env.SECURE_BASE_PATH;
    if (!secureBasePath) throw new Error('SECURE_BASE_PATH is not set');

    const diskPath = secureBasePath + entry.path;
    const updatedPath = secureBasePath + entry.parent_directory?.path + '/' + entry.display_name;

    let realPath = '';

    try {
        await fs.access(diskPath);
        realPath = diskPath;
    } catch {
        logData({
            title: "Directory's path has been updated, trying with parent's path",
            data: { diskPath, updatedPath, entry },
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });
    }

    if (!realPath) {
        try {
            await fs.access(updatedPath);
            realPath = updatedPath;
        } catch {
            throw new Error(`Directory not found on disk: ${diskPath} or ${updatedPath}`);
        }
    }

    const platformService = new PlatformService();
    platformService.setApiToken(apiKey);

    logData({
        title: `Processing directory: ${entry.display_name}`,
        data: { realPath, documentId: entry.documentId },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });

    const scanResult = await scanDirectoryOnDisk(realPath);

    await processEpisodesInDirectory({
        episodes: scanResult.episodes,
        directory: entry,
        platformService,
    });

    let coverId: number | undefined = undefined;

    if (scanResult.hasCover) {
        coverId = await uploadDirectoryCover({
            coverPath: path.join(realPath, 'cover.jpg'),
            apiKey,
        });
    }

    const tagIds =
        scanResult.metadata && scanResult.metadata.tags.length > 0
            ? await resolveDirectoryTags(scanResult.metadata.tags, entry.path, platformService)
            : [];

    await processChildDirectories({
        childNames: scanResult.childDirectories,
        parentDirectory: entry,
        platformService,
        realParentDirPath: realPath,
    });

    await finalizeDirectory({
        entry,
        description: scanResult.metadata?.description,
        coverId,
        tagIds,
        platformService,
    });
};

export default processDirectoryWebhook;
