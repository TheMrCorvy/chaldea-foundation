import { getPrisma } from './connection';
import { Prisma, JobQueue } from '@prisma/client';
import { logData } from '@salvatore.hakase/log-data';
import getPlatformServiceClient from './utils';

const addJobToQueue = async (type: string, payload: unknown): Promise<JobQueue> => {
    const prisma = getPrisma();

    const job = await prisma.jobQueue.create({
        data: {
            type,
            payload: payload as Prisma.InputJsonValue,
        },
    });

    try {
        const platformService = getPlatformServiceClient();

        if (!platformService) {
            logData({
                title: `Platform service client not initialized. Skipping reporting queued job ${job.id} to Strapi`,
                layer: '*',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(
                'Platform service client not initialized. Please set STRAPI_API_KEY in your environment variables.'
            );
        }

        const { data, error } = await platformService.call('bReportPostBReports', {
            body: {
                data: {
                    title: type,
                    description: `Job of type '${type}' with ID ${job.id} has been added to the queue and is pending.`,
                    state: 'pending',
                    type_of_report: type,
                    job_id: job.id,
                    raw_payload: payload,
                },
            },
        });

        if (error) {
            logData({
                title: `Failed to report queued job ${job.id} to Strapi`,
                data: { error },
                layer: '*',
                type: 'error',
                timeStamp: true,
            });

            throw new Error(`Failed to report queued job ${job.id} to Strapi: ${error}`);
        }

        logData({
            title: `Successfully reported queued job ${job.id} to Strapi`,
            data: { reportId: data?.data?.documentId },
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });
    } catch (err) {
        logData({
            title: `Error while reporting queued job ${job.id} to Strapi`,
            data: { error: String(err) },
            layer: 'queue_jobs',
            type: 'error',
            timeStamp: true,
        });
    }

    return job;
};

export default addJobToQueue;
