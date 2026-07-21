import { getPrisma } from './connection';
import { Prisma } from '@prisma/client';
import { logData } from '@salvatore.hakase/log-data';
import getPlatformServiceClient from './utils';

const markJobDone = async (id: number): Promise<void> => {
    const prisma = getPrisma();

    await prisma.$transaction(async tx => {
        const job = await tx.jobQueue.findUnique({
            where: { id },
        });

        if (!job) {
            throw new Error(`Job with id ${id} not found in queue`);
        }

        await tx.finishedJob.create({
            data: {
                type: job.type,
                payload: job.payload as Prisma.InputJsonValue,
                attempts: job.attempts,
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

        const { data, error } = await platformService.call('bReportGetBReports', {
            query: {
                filters: {
                    job_id: {
                        $eq: id,
                    },
                },
            },
        });

        if (error) {
            logData({
                title: `Failed to find Strapi report to delete for job ${id}`,
                data: { error },
                layer: '*',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(`Failed to find Strapi report to delete for job ${id}: ${error}`);
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

        const deleteRes = await platformService.call('bReportDeleteBReportsById', {
            path: {
                id: data.data[0].documentId,
            },
        });

        if (deleteRes.error) {
            logData({
                title: `Failed to delete Strapi report ${data.data[0].documentId} for job ${id}`,
                data: { error: deleteRes.error },
                layer: '*',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(
                `Failed to delete Strapi report ${data.data[0].documentId} for job ${id}: ${deleteRes.error}`
            );
        }

        logData({
            title: `Successfully deleted Strapi report ${data.data[0].documentId} for finished job ${id}`,
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });
    } catch (err) {
        logData({
            title: `Error while deleting Strapi report for job ${id}`,
            data: { error: String(err) },
            layer: '*',
            type: 'error',
            timeStamp: true,
        });
    }
};

export default markJobDone;
