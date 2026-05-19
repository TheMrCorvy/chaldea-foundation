import type { RemoteStorageAdapter } from "./adapter";
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

export class RemoteStorageClient {
    constructor(private readonly adapter: RemoteStorageAdapter) {}

    public upload(input: UploadInput): Promise<UploadResult> {
        return this.adapter.upload(input);
    }

    public download(input: DownloadInput): Promise<DownloadResult> {
        return this.adapter.download(input);
    }

    public overwrite(input: OverwriteInput): Promise<OverwriteResult> {
        return this.adapter.overwrite(input);
    }

    public delete(input: DeleteInput): Promise<DeleteResult> {
        return this.adapter.delete(input);
    }
}
