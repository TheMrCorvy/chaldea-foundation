import type { RemoteStorageAdapter } from "./adapter";
import { RemoteStorageProvider } from "./types";
import { GoogleDriveAdapter } from "./providers/google-drive/google-drive.adapter";
import { loadGoogleDriveConfig } from "./providers/google-drive/google-drive.config";

export function getAdapter(
    provider: RemoteStorageProvider
): RemoteStorageAdapter {
    let adapter: RemoteStorageAdapter;

    switch (provider) {
        case RemoteStorageProvider.GoogleDrive:
            adapter = new GoogleDriveAdapter(loadGoogleDriveConfig());
            break;
        case RemoteStorageProvider.S3:
        case RemoteStorageProvider.GoogleCloudStorage:
        case RemoteStorageProvider.Custom:
            throw new Error(`Provider "${provider}" is not implemented yet.`);
        case RemoteStorageProvider.Default:
            adapter = new GoogleDriveAdapter(loadGoogleDriveConfig());
            break;
        default: {
            const exhaustiveCheck: never = provider;
            throw new Error(`Unknown provider: ${String(exhaustiveCheck)}`);
        }
    }

    return adapter;
}
