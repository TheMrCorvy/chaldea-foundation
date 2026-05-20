import path from "path";

import readDriveBackupRootFromConfig from "./readDriveBackupRootFromConfig";

export default function resolveDriveBackupRoot(rootPath: string): string {
    const configuredRoot = readDriveBackupRootFromConfig();

    if (configuredRoot) {
        if (configuredRoot.startsWith("/")) {
            return configuredRoot;
        }

        return `/${configuredRoot}`;
    }

    const repositoryName = path.basename(path.resolve(rootPath));
    return `/${repositoryName}`;
}
