import { logData } from '@salvatore.hakase/log-data';
import PlatformService from '@repo/platform-service-sdk';
import { getFailedJobs, deleteFailedJob } from '../database/jobQueue';

export async function reportFailedJobs(): Promise<void> {
    logData({
        title: 'Starting daily failed jobs reporting job',
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });

    const apiKey = process.env.STRAPI_API_KEY;
    if (!apiKey) {
        logData({
            title: 'STRAPI_API_KEY is not set. Cannot run daily failed jobs reporting job.',
            layer: 'queue_jobs',
            type: 'error',
            timeStamp: true,
            addSpaceAfter: true,
            addSeparatorAfter: true,
        });
        return;
    }

    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    const failedJobs = await getFailedJobs();

    logData({
        title: `Found ${failedJobs.length} failed jobs to report`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
        addSeparatorAfter: true,
    });

    for (const job of failedJobs) {
        const payloadStr =
            job.payload && typeof job.payload === 'object' ? JSON.stringify(job.payload, null, 2) : String(job.payload);

        const reportData = {
            title: 'S.O.S. Cron job failed!',
            description: `ID: ${job.id}
Type: ${job.type}
Attempts: ${job.attempts}
Failed At: ${job.failed_at.toISOString()}
Created At: ${job.created_at.toISOString()}
Last Error: ${job.last_error || 'No error message'}
Payload: ${payloadStr}`,
        };

        try {
            const { data, error } = await platformService.call('bReportPostBReports', {
                body: {
                    data: reportData,
                },
            });

            if (error) {
                logData({
                    title: `Failed to report failed job ${job.id} to Strapi`,
                    data: { error },
                    layer: 'queue_jobs',
                    type: 'error',
                    timeStamp: true,
                    addSpaceAfter: true,
                    addSeparatorAfter: true,
                });
            } else {
                logData({
                    title: `Successfully reported failed job ${job.id} to Strapi`,
                    data: { reportId: data?.data?.documentId },
                    layer: 'queue_jobs',
                    type: 'info',
                    timeStamp: true,
                    addSpaceAfter: true,
                    addSeparatorAfter: true,
                });
                await deleteFailedJob(job.id);
            }
        } catch (err) {
            logData({
                title: `Error while reporting failed job ${job.id} to Strapi`,
                data: { error: String(err) },
                layer: 'queue_jobs',
                type: 'error',
                timeStamp: true,
                addSpaceAfter: true,
                addSeparatorAfter: true,
            });
        }
    }
}
