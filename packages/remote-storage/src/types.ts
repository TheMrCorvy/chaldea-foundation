export type RemoteStorageProvider =
    | "google-drive"
    | "aws-s3"
    | "google-cloud-storage"
    | "custom";

export interface StorageFileReference {
    id: string;
    provider?: RemoteStorageProvider;
    metadata?: Record<string, unknown>;
}

export interface UploadInput {
    localPath: string;
    fileName?: string;
    destinationPath?: string;
    mimeType?: string;
    metadata?: Record<string, unknown>;
}

export interface UploadResult {
    file: StorageFileReference;
    sizeBytes?: number;
    checksum?: string;
}

export interface DownloadInput {
    file: StorageFileReference;
    targetPath?: string;
}

export interface DownloadResult {
    localPath: string;
    metadata?: Record<string, unknown>;
}

export interface OverwriteInput {
    file: StorageFileReference;
    localPath: string;
    mimeType?: string;
    metadata?: Record<string, unknown>;
}

export interface OverwriteResult {
    file: StorageFileReference;
    updatedAt?: string;
}

export interface DeleteInput {
    file: StorageFileReference;
}

export interface DeleteResult {
    deleted: boolean;
    fileId: string;
}
