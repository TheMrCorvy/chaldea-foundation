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

export interface RemoteStorageAdapter {
    upload(input: UploadInput): Promise<UploadResult>;
    download(input: DownloadInput): Promise<DownloadResult>;
    overwrite(input: OverwriteInput): Promise<OverwriteResult>;
    delete(input: DeleteInput): Promise<DeleteResult>;
}
