import type { JobRadarEntry } from '../types/strapiWebhook.types';
import { logData } from '@salvatore.hakase/log-data';

export interface DeleteCustomCvsParams {
    payload: JobRadarEntry; // Replace 'any' with the actual type of the payload if available
}

export type DeleteCustomCvs = (params: DeleteCustomCvsParams) => Promise<void>;

const deleteCustomCvs: DeleteCustomCvs = async ({ payload }) => {
    const customCv = payload.custom_cv;

    if (customCv) {
        let fileId: number | null = null;
        if (typeof customCv === 'object' && customCv !== null && 'id' in customCv) {
            const customCvObj = customCv as Record<string, unknown>;
            if (typeof customCvObj.id === 'number') {
                fileId = customCvObj.id;
            }
        } else if (typeof customCv === 'number') {
            fileId = customCv;
        } else if (typeof customCv === 'string') {
            const parsedId = parseInt(customCv, 10);
            if (!isNaN(parsedId)) {
                fileId = parsedId;
            }
        }

        if (fileId !== null) {
            logData({
                title: `Deleting associated custom_cv media file (ID: ${fileId}) from Strapi`,
                data: { jobListingId: payload.id, fileId },
                layer: 'webhooks_received',
                type: 'info',
                timeStamp: true,
            });

            const apiBaseUrl = process.env.STRAPI_BASE_URL ?? 'http://localhost:1337/api';
            const strapiApiKey = process.env.STRAPI_API_KEY || '';
            const deleteUrl = `${apiBaseUrl}/upload/files/${fileId}`;

            try {
                const response = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${strapiApiKey}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    logData({
                        title: `Failed to delete associated custom_cv media file (ID: ${fileId}) from Strapi`,
                        data: { status: response.status, statusText: response.statusText, errorText },
                        layer: '*',
                        type: 'error',
                        timeStamp: true,
                    });
                } else {
                    logData({
                        title: `Successfully deleted associated custom_cv media file (ID: ${fileId}) from Strapi`,
                        data: { jobListingId: payload.id, fileId },
                        layer: 'webhooks_received',
                        type: 'info',
                        timeStamp: true,
                    });
                }
            } catch (err) {
                logData({
                    title: `Error deleting associated custom_cv media file (ID: ${fileId}) from Strapi`,
                    data: { error: String(err) },
                    layer: '*',
                    type: 'error',
                    timeStamp: true,
                });
            }
        }
    }
};

export default deleteCustomCvs;
