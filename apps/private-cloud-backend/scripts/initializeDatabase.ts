import { scanSingleFolder, writeJsonFile } from '../src/services/diskService';
import dotenv from 'dotenv';
import { LocalDirectory } from '../src/utils/typesDefinition';
import sortDirectories from '../src/utils/sortDirectories';

// Load environment variables BEFORE importing the SDK
dotenv.config();

import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@repo/shared-utils/log-data';

const main = async () => {
    const initiumIter: string[] = process.env.INITIAL_PATH ? JSON.parse(process.env.INITIAL_PATH) : [];
    const outputFolderPath = './db';
    const excludedParents: string[] = process.env.EXCLUDED_PARENTS ? JSON.parse(process.env.EXCLUDED_PARENTS) : [];
    const strapiApiKey = process.env.STRAPI_API_KEY;

    if (!initiumIter || initiumIter.length < 1 || !strapiApiKey || !excludedParents) {
        throw new Error('Environment variables are not set.');
    }

    const platformService = new PlatformService();
    platformService.setApiToken(strapiApiKey);

    logData({
        layer: '*',
        addSeparatorAfter: true,
        addSeparatorBefore: true,
        addSpaceAfter: true,
        addSpaceBefore: true,
        title: 'Environment variables set. Proceeding with database initialization...',
    });

    const organizedData: LocalDirectory[][] = [];

    initiumIter.forEach((initialPath, i) => {
        const data = scanSingleFolder({
            dirPath: initialPath,
            excludedParents,
        });

        const pendingToScan: string[] = data.sub_directories;
        const finalResult: LocalDirectory[] = data.episodes
            ? [
                  {
                      ...scanSingleFolder({
                          dirPath: data.directory_path,
                          excludedParents,
                          excludeSubDirectories: true,
                      }),
                      parent_directory: null,
                  },
              ]
            : [];

        while (pendingToScan.length > 0) {
            for (let index = pendingToScan.length - 1; index >= 0; index--) {
                const dirPath = pendingToScan[index];
                const folderToRemoveFromPending = pendingToScan.indexOf(dirPath);
                pendingToScan.splice(folderToRemoveFromPending, 1);

                const scannedData = scanSingleFolder({
                    dirPath,
                    excludedParents,
                });

                if (!excludedParents.includes(scannedData.display_name)) {
                    finalResult.push(scannedData);
                }
                pendingToScan.push(...scannedData.sub_directories);
            }
        }

        logData({
            layer: '*',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            addSeparatorBefore: true,
            title: 'Scanned all directories for root folder. Now writting into json db...',
        });

        organizedData.push(finalResult);

        logData({
            layer: '*',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            addSeparatorBefore: true,
            title: 'Json db written. Calling Strapi to get already existing Drirectories and Anime Episodes...',
        });

        return;
    });

    writeJsonFile({ outputFolderPath, data: organizedData, fileName: 'full data' });

    const skippedDirectories: LocalDirectory[] = [];
    const failedDirectories: any[] = [];

    for (const mainFolder of organizedData) {
        const pendingDirectories = sortDirectories([...mainFolder]);

        for (const localDirectory of pendingDirectories) {
            logData({
                layer: '*',
                title: 'Validating existance fo directory: ' + localDirectory.display_name + '...',
                addSpaceAfter: true,
            });

            const directoryAlreadyExists = await platformService.call('bDirectoryGetBDirectories', {
                query: {
                    filters: {
                        path: {
                            $eq: localDirectory.directory_path,
                        },
                    },
                },
            });

            if (directoryAlreadyExists.error || !directoryAlreadyExists.data.data) {
                failedDirectories.push({ ...localDirectory, error: directoryAlreadyExists });
                logData({
                    layer: '*',
                    title: `Error checking if directory exists in strapi`,
                    data: directoryAlreadyExists.error,
                    addSpaceAfter: true,
                });

                continue;
            }

            if (directoryAlreadyExists.data.data.length > 0) {
                skippedDirectories.push(localDirectory);

                logData({
                    layer: '*',
                    title: 'Directory already exists in strapi, skipping...',
                    addSpaceAfter: true,
                });

                continue;
            }

            let parentDirectoryDocId = '';

            if (localDirectory.parent_directory) {
                const remoteParent = await platformService.call('bDirectoryGetBDirectories', {
                    query: {
                        filters: {
                            path: {
                                $eq: localDirectory.parent_directory,
                            },
                        },
                    },
                });

                if (!remoteParent.data.data || remoteParent.error || remoteParent.data.data.length !== 1) {
                    failedDirectories.push(localDirectory);
                    logData({
                        layer: '*',
                        title: `Remote parent directory was not found in strapi, or there were multiple matches. Skipping directory`,
                        data: localDirectory,
                        addSpaceAfter: true,
                    });

                    continue;
                }

                logData({
                    layer: '*',
                    title: 'Found the parent directory, storing it in the parent_directory prop',
                    addSpaceAfter: true,
                    data: remoteParent,
                });

                parentDirectoryDocId = remoteParent.data.data[0].documentId;
            }

            const reqData = {
                display_name: localDirectory.display_name,
                path: localDirectory.directory_path,
                adult: localDirectory.adult ? '1' : '0',
            } as Record<string, string>;

            if (parentDirectoryDocId) {
                reqData.parent_directory = parentDirectoryDocId;
            }

            logData({
                layer: '*',
                title: 'Storing directory in Strapi',
                addSpaceAfter: true,
                data: reqData,
            });

            const storedDirectory = await platformService.call('bDirectoryPostBDirectories', {
                body: {
                    data: reqData,
                },
            });

            if (storedDirectory.error || !storedDirectory.data.data) {
                failedDirectories.push(localDirectory);
                logData({
                    layer: '*',
                    title: `Error storing directory in strapi`,
                    data: storedDirectory,
                    addSpaceAfter: true,
                });

                continue;
            }

            logData({
                layer: '*',
                title: 'Created directory in strapi: ' + storedDirectory.data.data.display_name,
                addSpaceAfter: true,
            });

            for (const episode of localDirectory.episodes) {
                const storedEpisode = await platformService.call('bEpisodePostBEpisodes', {
                    body: {
                        data: {
                            display_name: episode.display_name,
                            parent_directory: storedDirectory.data.data.documentId,
                            file_type: episode.file_type,
                        },
                    },
                });

                if (storedEpisode.error || !storedEpisode.data.data) {
                    failedDirectories.push(localDirectory);
                    logData({
                        layer: '*',
                        title: `Error storing episode in strapi`,
                        data: storedEpisode,
                        addSpaceAfter: true,
                    });

                    continue;
                }

                logData({
                    layer: '*',
                    title: 'Stored episode: ' + episode.display_name,
                    addSpaceAfter: true,
                });
            }

            logData({
                layer: '*',
                title: `Finished storing ${localDirectory.display_name}.`,
                addSpaceAfter: true,
                addSeparatorAfter: true,
            });
        }
    }

    if (skippedDirectories.length > 0) {
        logData({
            layer: '*',
            title: 'There were some directories that were skipped during the upload process...',
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        writeJsonFile({ outputFolderPath, data: skippedDirectories, fileName: 'skipped directories' });
    }

    if (failedDirectories.length > 0) {
        logData({
            layer: '*',
            title: 'There were some directories that failed to store in Strapi during the upload process...',
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        writeJsonFile({ outputFolderPath, data: failedDirectories, fileName: 'failed directories' });
    }
};

if (require.main === module) {
    main();
}
