export interface MediafireConfig {
    email: string;
    password: string;
    appId: string;
    apiKey: string;
}

export interface UploadFileOptions {
    localPath: string;
    remoteFolderKey?: string;
}

export interface DownloadFileOptions {
    quickKey: string;
    outputPath: string;
}

export interface DeleteFileOptions {
    quickKey: string;
}
