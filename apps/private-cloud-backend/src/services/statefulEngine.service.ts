import { getPrisma } from '../database/connection';
import { processJobs } from './jobProcessor.service';
import { logData } from '@salvatore.hakase/log-data';
import { TimeOptions } from '@repo/type-definitions/jobs';
import PlatformService from '@repo/platform-service-sdk';
import { parseTimeOption } from '../utils/jobUtils';

let intervalId: NodeJS.Timeout | null = null;
let timeoutId: NodeJS.Timeout | null = null;
let isRunning = false;
let isProcessing = false;
let reportDocumentId: string | null = null;

export const stopEngine = async (): Promise<void> => {
    if (intervalId) {
        global.clearInterval(intervalId);
        intervalId = null;
    }

    if (timeoutId) {
        global.clearTimeout(timeoutId);
        timeoutId = null;
    }

    if (isRunning) {
        isRunning = false;
        logData({
            title: 'Stateful engine stopped',
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });
    }

    const apiKey = process.env.STRAPI_API_KEY;

    if (!reportDocumentId || !apiKey) {
        reportDocumentId = null;

        return;
    }

    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    await platformService.call('bReportDeleteBReportsById', {
        path: { id: reportDocumentId },
    });

    reportDocumentId = null;
};

const checkAndProcessJobs = async (): Promise<void> => {
    if (isProcessing) {
        logData({
            title: 'Stateful engine: Skipping tick — previous run still in progress',
            layer: 'queue_jobs',
            type: 'warn',
            timeStamp: true,
        });

        return;
    }

    isProcessing = true;

    const prisma = getPrisma();

    const count = await prisma.jobQueue.count();

    if (count === 0) {
        logData({
            title: 'Stateful engine: No jobs left in queue, stopping engine',
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });

        await stopEngine();
        return;
    }

    logData({
        title: `Stateful engine: Processing jobs (${count} pending in queue)`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });

    await processJobs();

    const postCount = await prisma.jobQueue.count();

    if (postCount === 0) {
        logData({
            title: 'Stateful engine: Queue became empty after processing, stopping engine',
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });

        await stopEngine();
    }

    isProcessing = false;
};

export const startEngine = async (every: TimeOptions, during: TimeOptions | 'until_finishing_jobs'): Promise<void> => {
    await stopEngine();
    isRunning = true;

    const apiKey = process.env.STRAPI_API_KEY;

    if (!apiKey) {
        isRunning = false;

        logData({
            title: 'Missing STRAPI_API_KEY environment variable. Cannot report engine status.',
            layer: '*',
            type: 'error',
            timeStamp: true,
        });

        throw new Error('Missing STRAPI_API_KEY environment variable. Cannot report engine status.');
    }

    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    const { data } = await platformService.call('bReportPostBReports', {
        body: {
            data: {
                title: 'Stateful Engine Running',
                description: `Stateful engine is running (every: ${every}, during: ${during})`,
                state: 'pending',
                type_of_report: 'stateful_engine',
                raw_payload: {
                    every,
                    during,
                },
            },
        },
    });

    if (data?.data?.documentId) {
        reportDocumentId = data.data.documentId;
    }

    // Parse time options into miliseconds
    const everyMs = parseTimeOption(every);

    if (during !== 'until_finishing_jobs') {
        timeoutId = global.setTimeout(() => {
            logData({
                title: `Stateful engine: Time limit of ${during} reached, stopping engine`,
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
            });

            void stopEngine();
        }, parseTimeOption(during));
    }

    intervalId = global.setInterval(() => {
        void checkAndProcessJobs();
    }, everyMs);
};
