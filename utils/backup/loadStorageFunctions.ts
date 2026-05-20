import type { StorageFunctions } from "./types";

export default async function loadStorageFunctions(): Promise<StorageFunctions> {
    const remoteStorage = await import("@repo/remote-storage");
    let upload: StorageFunctions["upload"] | null = null;
    let overwrite: StorageFunctions["overwrite"] | null = null;

    if (typeof remoteStorage.upload === "function") {
        upload = remoteStorage.upload;
    }

    if (typeof remoteStorage.overwrite === "function") {
        overwrite = remoteStorage.overwrite;
    }

    if (remoteStorage.default) {
        if (!upload && typeof remoteStorage.default.upload === "function") {
            upload = remoteStorage.default.upload;
        }

        if (
            !overwrite &&
            typeof remoteStorage.default.overwrite === "function"
        ) {
            overwrite = remoteStorage.default.overwrite;
        }
    }

    if (!upload) {
        throw new Error(
            'The package "@repo/remote-storage" does not export upload().'
        );
    }

    if (!overwrite) {
        throw new Error(
            'The package "@repo/remote-storage" does not export overwrite().'
        );
    }

    return {
        upload,
        overwrite,
    };
}
