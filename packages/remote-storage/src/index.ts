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
    return getAdapter(input.provider || RemoteStorageProvider.Default).upload(
        input
    );
}

export function download(input: DownloadInput): Promise<DownloadResult> {
    return getAdapter(
        input.file.provider || RemoteStorageProvider.Default
    ).download(input);
}

export function overwrite(input: OverwriteInput): Promise<OverwriteResult> {
    return getAdapter(
        input.file.provider || RemoteStorageProvider.Default
    ).overwrite(input);
}

export function deleteFile(input: DeleteInput): Promise<DeleteResult> {
    return getAdapter(
        input.file.provider || RemoteStorageProvider.Default
    ).delete(input);
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
