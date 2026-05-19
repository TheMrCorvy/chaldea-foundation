import { getAdapter } from "./factory";
import {
    RemoteStorageProvider,
    type DeleteInput,
    type DeleteResult,
    type DownloadInput,
    type DownloadResult,
    type OverwriteInput,
    type OverwriteResult,
    type UploadInput,
    type UploadResult,
} from "./types";

export function upload(input: UploadInput): Promise<UploadResult> {
    let provider = RemoteStorageProvider.Default;
    if (input.provider) {
        provider = input.provider;
    }

    return getAdapter(provider).upload(input);
}

export function download(input: DownloadInput): Promise<DownloadResult> {
    let provider = RemoteStorageProvider.Default;
    if (input.file.provider) {
        provider = input.file.provider;
    }

    return getAdapter(provider).download(input);
}

export function overwrite(input: OverwriteInput): Promise<OverwriteResult> {
    let provider = RemoteStorageProvider.Default;
    if (input.file.provider) {
        provider = input.file.provider;
    }

    return getAdapter(provider).overwrite(input);
}

export function deleteFile(input: DeleteInput): Promise<DeleteResult> {
    let provider = RemoteStorageProvider.Default;
    if (input.file.provider) {
        provider = input.file.provider;
    }

    return getAdapter(provider).delete(input);
}

export { deleteFile as delete };

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
