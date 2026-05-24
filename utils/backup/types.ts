export interface BackupEntry {
    absolutePath: string;
    relativePath: string;
    destinationPath: string;
}

export interface BackupIdsEntry {
    fileName: string;
    localPath: string;
    relativePath: string;
    driveId: string;
    destinationPath: string;
}

export interface BackupIdsIndex {
    backupIds: BackupIdsEntry[];
}

export interface ScanContext {
    rootRealPath: string;
    visitedRealDirectories: Set<string>;
    seenRealFiles: Set<string>;
    allowedApps: string[];
    allowedExtensions: string[];
}

export interface StorageFunctions {
    upload: (input: {
        localPath: string;
        destinationPath: string;
        metadata?: Record<string, unknown>;
    }) => Promise<{ file: { id: string }; checksum?: string }>;
    overwrite: (input: {
        file: { id: string; metadata?: Record<string, unknown> };
        localPath: string;
        metadata?: Record<string, unknown>;
    }) => Promise<{ file: { id: string }; updatedAt?: string }>;
}
