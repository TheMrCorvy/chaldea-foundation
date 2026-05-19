import type { RemoteStorageAdapter } from "./adapter";
import { RemoteStorageClient } from "./client";
import type {
    DeleteInput,
    DeleteResult,
    DownloadInput,
    DownloadResult,
    OverwriteInput,
    OverwriteResult,
    UploadInput,
    UploadResult,
} from "./types";

let client: RemoteStorageClient | null = null;

export function configureRemoteStorage(adapter: RemoteStorageAdapter): void {
    client = new RemoteStorageClient(adapter);
}

function getClient(): RemoteStorageClient {
    if (!client) {
        throw new Error(
            "Remote storage adapter is not configured. Call configureRemoteStorage() first."
        );
    }

    return client;
}

export function upload(input: UploadInput): Promise<UploadResult> {
    return getClient().upload(input);
}

export function download(input: DownloadInput): Promise<DownloadResult> {
    return getClient().download(input);
}

export function overwrite(input: OverwriteInput): Promise<OverwriteResult> {
    return getClient().overwrite(input);
}

export function deleteFile(input: DeleteInput): Promise<DeleteResult> {
    return getClient().delete(input);
}

export { deleteFile as delete };

export { RemoteStorageClient };
export type { RemoteStorageAdapter } from "./adapter";
export type {
    DeleteInput,
    DeleteResult,
    DownloadInput,
    DownloadResult,
    OverwriteInput,
    OverwriteResult,
    RemoteStorageProvider,
    StorageFileReference,
    UploadInput,
    UploadResult,
} from "./types";
