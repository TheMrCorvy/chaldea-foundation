import type { JobRadarEntry } from '../types/strapiWebhook.types';
import { logData } from '@salvatore.hakase/log-data';

export interface DeleteCustomCvsParams {
    payload: JobRadarEntry; // Replace 'any' with the actual type of the payload if available
}

export type DeleteCustomCvs = (params: DeleteCustomCvsParams) => Promise<void>;

const deleteCustomCvs: DeleteCustomCvs = async ({ payload }) => {
    const strapiJobId = payload.documentId;

    if (!strapiJobId) {
        logData({
            title: `No documentId found in payload for job listing (ID: ${payload.documentId}), skipping deletion`,
            data: payload,
            layer: 'webhooks_received',
            type: 'warn',
            timeStamp: true,
        });
        return;
    }

    logData({
        title: `Searching for custom_cv media file with name matching documentId: ${strapiJobId}`,
        data: strapiJobId,
        layer: 'webhooks_received',
        type: 'info',
        timeStamp: true,
    });

    const apiBaseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
    const strapiApiKey = process.env.STRAPI_API_KEY || '';
    const searchUrl = `${apiBaseUrl}/upload/files?filters[name][$eq]=${strapiJobId}`;

    try {
        const searchResponse = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${strapiApiKey}`,
            },
        });

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            logData({
                title: `Failed to search for media file with name: ${strapiJobId}`,
                data: { status: searchResponse.status, statusText: searchResponse.statusText, errorText },
                layer: '*',
                type: 'error',
                timeStamp: true,
            });
            return;
        }

        const files = (await searchResponse.json()) as Array<{ id: number; name: string }>;

        if (!Array.isArray(files) || files.length === 0) {
            logData({
                title: `No media file found with name: ${strapiJobId}, skipping deletion`,
                data: strapiJobId,
                layer: 'webhooks_received',
                type: 'info',
                timeStamp: true,
            });
            return;
        }

        for (const file of files) {
            const fileId = file.id;
            const deleteUrl = `${apiBaseUrl}/upload/files/${fileId}`;

            logData({
                title: `Deleting associated custom_cv media file ${file.name} from Strapi`,
                data: { documentId: payload.documentId, fileId, fileName: file.name },
                layer: 'webhooks_received',
                type: 'info',
                timeStamp: true,
            });

            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${strapiApiKey}`,
                },
            });

            if (!deleteResponse.ok) {
                const errorText = await deleteResponse.text();

                logData({
                    title: `Failed to delete associated custom_cv media file (ID: ${fileId}) from Strapi`,
                    data: { status: deleteResponse.status, statusText: deleteResponse.statusText, errorText },
                    layer: '*',
                    type: 'error',
                    timeStamp: true,
                });

                throw new Error(
                    `Failed to delete media file with ID: ${fileId}, status: ${deleteResponse.status}, statusText: ${deleteResponse.statusText}`
                );
            } else {
                logData({
                    title: `Successfully deleted associated custom_cv media file (ID: ${fileId}) from Strapi`,
                    data: { jobListingId: payload.id, fileId, fileName: file.name },
                    layer: 'webhooks_received',
                    type: 'info',
                    timeStamp: true,
                });
            }
        }
    } catch (err) {
        logData({
            title: `Error processing custom_cv deletion for job listing (ID: ${payload.id})`,
            data: { error: String(err) },
            layer: '*',
            type: 'error',
            timeStamp: true,
        });
    }
};

export default deleteCustomCvs;
