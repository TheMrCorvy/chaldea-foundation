import { getPrisma } from './connection';
import { Prisma } from '@prisma/client';
import { logData } from '@salvatore.hakase/log-data';
import getPlatformServiceClient from './utils';

const markJobFailed = async (id: number, error: string): Promise<void> => {
    const prisma = getPrisma();

    await prisma.$transaction(async tx => {
        const job = await tx.jobQueue.findUnique({
            where: { id },
        });

        if (!job) {
            throw new Error(`Job with id ${id} not found in queue`);
        }

        await tx.failedJob.create({
            data: {
                type: job.type,
                payload: job.payload as Prisma.InputJsonValue,
                attempts: job.attempts,
                last_error: error,
                created_at: job.created_at,
            },
        });

        await tx.jobQueue.delete({
            where: { id },
        });
    });

    try {
        const platformService = getPlatformServiceClient();

        if (!platformService) {
            logData({
                title: `Platform service client not initialized. Skipping reporting queued job ${id} to Strapi`,
                layer: '*',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(
                'Platform service client not initialized. Please set STRAPI_API_KEY in your environment variables.'
            );
        }

        const { data, error: getError } = await platformService.call('bReportGetBReports', {
            query: {
                filters: {
                    job_id: {
                        $eq: id,
                    },
                },
            },
        });

        if (getError) {
            logData({
                title: `Failed to find Strapi report to mark failed for job ${id}`,
                data: { error: getError },
                layer: 'queue_jobs',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(`Failed to find Strapi report to mark failed for job ${id}: ${getError}`);
        }

        if (!data.data || data.data.length === 0) {
            logData({
                title: `No Strapi report found to delete for job ${id}`,
                layer: '*',
                type: 'info',
                timeStamp: true,
            });

            throw new Error(`No Strapi report found to delete for job ${id}`);
        }

        const updateRes = await platformService.call('bReportPutBReportsById', {
            path: {
                id: data.data[0].documentId,
            },
            body: {
                data: {
                    title: `Job Failed: ${data.data[0].type_of_report || ''}`,
                    description: `Job with ID ${id} failed. Error: ${error}`,
                    state: 'failed',
                },
            },
        });

        if (updateRes.error) {
            logData({
                title: `Failed to update Strapi report ${data.data[0].documentId} to failed for job ${id}`,
                data: { error: updateRes.error },
                layer: 'queue_jobs',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(
                `Failed to update Strapi report ${data.data[0].documentId} to failed for job ${id}: ${updateRes.error}`
            );
        }

        logData({
            title: `Successfully updated Strapi report ${data.data[0].documentId} to failed for job ${id}`,
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });
    } catch (err) {
        logData({
            title: `Error while updating Strapi report to failed for job ${id}`,
            data: { error: String(err) },
            layer: 'queue_jobs',
            type: 'error',
            timeStamp: true,
        });
    }
};
export default markJobFailed;
