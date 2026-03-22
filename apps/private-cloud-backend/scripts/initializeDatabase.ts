import { writeJsonFile } from '../src/services/diskService';
import dotenv from 'dotenv';
import { LocalDirectory } from '../src/utils/typesDefinition';
import sortDirectories from '../src/utils/sortDirectories';
import verifyEpisodeExistance from '../src/utils/db_init/verifyEpisodeExistance';
import updateEpisodeInStrapi from '../src/utils/db_init/updateEpisodeInStrapi';
import envVerification from '../src/utils/db_init/envVerification';
import scanAndOrganizeDirectories from '../src/utils/db_init/scanAndOrganizeDirectories';
import verifyDirectoryExistance from '../src/utils/db_init/verifyDirectoryExistance';

// Load environment variables BEFORE importing the SDK
dotenv.config();

import PlatformService from '@repo/platform-service-sdk';
import { logData } from '@repo/shared-utils/log-data';
import { processVideoFile } from '../src/services/ffmpegService';

const main = async () => {
    console.clear();

    const outputFolderPath = './db';
    const env = envVerification();

    const platformService = new PlatformService();
    platformService.setApiToken(env.strapiApiKey);

    const organizedData = scanAndOrganizeDirectories(env);

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

            const directoryAlreadyExists = await verifyDirectoryExistance({
                directory: localDirectory,
                failedDirectories,
                skippedDirectories,
            });

            if (directoryAlreadyExists.exists && directoryAlreadyExists.directory) {
                logData({
                    title: 'The directory already exists in strapi.',
                    type: 'info',
                    layer: '*',
                    addSpaceAfter: true,
                });
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
                const isVOne = episode.file_type === 'mp4' || episode.file_type === 'MP4';
                let metadata: any = null;

                const episodeExists = await verifyEpisodeExistance({
                    episode,
                    parentId: storedDirectory.data.data.documentId,
                });

                const dirHasFailedBefore = failedDirectories.find(
                    failedDir => failedDir.directory_path === localDirectory.directory_path
                );

                if (episodeExists.error !== undefined) {
                    if (!dirHasFailedBefore) {
                        failedDirectories.push({ localDirectory, episode, error: episodeExists });
                    }

                    logData({
                        layer: '*',
                        title: `Error checking if episode exists in strapi`,
                        data: episodeExists.error,
                        addSpaceAfter: true,
                        type: 'error',
                    });

                    continue;
                }

                if (!isVOne) {
                    logData({
                        title: `Processing episode: ${episode.display_name} (Type: ${isVOne ? 'V1' : 'V2'})`,
                        layer: '*',
                        addSpaceAfter: true,
                        data: {
                            localDirectory,
                            episode,
                        },
                    });

                    metadata = await processVideoFile(
                        env.secureBasePath +
                            localDirectory.directory_path +
                            '/' +
                            episode.display_name +
                            '.' +
                            episode.file_type
                    );
                }

                if (
                    metadata.everythingWorkedFine &&
                    (!metadata.everythingWorkedFine.audio || !metadata.everythingWorkedFine.subtitles)
                ) {
                    !dirHasFailedBefore && failedDirectories.push({ localDirectory, metadata });
                    continue;
                }

                if (episodeExists.exists && episodeExists.differs && episodeExists.existingEpisode) {
                    logData({
                        layer: '*',
                        title: 'Episode already exists but with different version. Updating episode with new version and metadata...',
                        addSpaceAfter: true,
                        data: {
                            existingEpisode: episodeExists.existingEpisode,
                            newVersion: episode.version || (isVOne ? 'V1' : 'V2'),
                        },
                        type: 'info',
                    });

                    const updatedEpisode = await updateEpisodeInStrapi({
                        metadata,
                        episode,
                        existingEpisodeId: episodeExists.existingEpisode.documentId,
                    });

                    if (updatedEpisode.error !== undefined && !dirHasFailedBefore) {
                        logData({
                            layer: '*',
                            title: `Error updating episode in strapi`,
                            data: updatedEpisode,
                            addSpaceAfter: true,
                        });

                        failedDirectories.push({ localDirectory, episode, error: updatedEpisode });
                    }

                    logData({
                        layer: '*',
                        title: 'Updated episode in strapi with new version and metadata: ' + episode.display_name,
                        addSpaceAfter: true,
                        type: 'info',
                    });

                    continue;
                }

                if (episodeExists.exists && !episodeExists.differs && episodeExists.existingEpisode) {
                    logData({
                        layer: '*',
                        title: 'Episode already exists in strapi with the same version, skipping...',
                        addSpaceAfter: true,
                        type: 'info',
                        data: episodeExists.existingEpisode,
                    });

                    continue;
                }

                const storedEpisode = await platformService.call('bEpisodePostBEpisodes', {
                    body: {
                        data: {
                            display_name: episode.display_name,
                            parent_directory: storedDirectory.data.data.documentId,
                            version: episode.version || (isVOne ? 'V1' : 'V2'),
                            file_type: episode.file_type,
                            languages_info: isVOne ? undefined : metadata,
                        },
                    },
                });

                if (storedEpisode.error || !storedEpisode.data.data) {
                    !dirHasFailedBefore && failedDirectories.push(localDirectory);

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
