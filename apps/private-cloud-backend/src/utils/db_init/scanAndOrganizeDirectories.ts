import { logData } from '@repo/shared-utils/log-data';
import { scanSingleFolder } from '../../services/diskService';
import { LocalDirectory } from '../typesDefinition';
import { VerifyEnvResult } from '../../types/dbInit';

const scanAndOrganizeDirectories = (env: VerifyEnvResult): LocalDirectory[][] => {
    logData({
        layer: '*',
        addSeparatorAfter: true,
        addSeparatorBefore: true,
        addSpaceAfter: true,
        addSpaceBefore: true,
        title: 'Environment variables set. Proceeding with database initialization...',
    });

    const organizedData: LocalDirectory[][] = [];

    env.initiumIter.forEach(initialPath => {
        const data = scanSingleFolder({
            dirPath: initialPath,
            excludedParents: env.excludedParents,
            secureBasePath: env.secureBasePath,
        });

        const pendingToScan: string[] = data.sub_directories;
        const finalResult: LocalDirectory[] = data.episodes
            ? [
                  {
                      ...scanSingleFolder({
                          dirPath: data.directory_path,
                          excludeSubDirectories: true,
                          excludedParents: env.excludedParents,
                          secureBasePath: env.secureBasePath,
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
                    excludedParents: env.excludedParents,
                    secureBasePath: env.secureBasePath,
                });

                if (!env.excludedParents.includes(scannedData.display_name)) {
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

    return organizedData;
};

export default scanAndOrganizeDirectories;
