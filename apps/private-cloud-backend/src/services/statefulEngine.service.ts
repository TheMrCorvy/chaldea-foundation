import { getPrisma } from '../database/connection';
import { processJobs } from './jobProcessor.service';
import { logData } from '@salvatore.hakase/log-data';
import { TimeOptions } from '@repo/type-definitions/jobs';

let intervalId: NodeJS.Timeout | null = null;
let timeoutId: NodeJS.Timeout | null = null;
let isRunning = false;

function parseTimeOption(option: TimeOptions): number {
    const match = option.match(/^(\d+)min$/);

    if (!match) {
        throw new Error(`Invalid time option format: ${option}`);
    }

    const minutes = parseInt(match[1], 10);
    return minutes * 60 * 1000;
}

export function isEngineRunning(): boolean {
    return isRunning;
}

export function stopEngine(): void {
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
}

async function checkAndProcessJobs(): Promise<void> {
    const prisma = getPrisma();

    try {
        const count = await prisma.jobQueue.count();

        if (count === 0) {
            logData({
                title: 'Stateful engine: No jobs left in queue, stopping engine',
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
            });

            stopEngine();
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

            stopEngine();
        }
    } catch (err) {
        logData({
            title: 'Stateful engine: Error checking or processing jobs',
            data: err instanceof Error ? { message: err.message } : { error: String(err) },
            layer: '*',
            type: 'error',
            timeStamp: true,
        });
    }
}

export function startEngine(every: TimeOptions, during: TimeOptions | 'until_finishing_jobs'): void {
    // Stop any existing running engine first to ensure clean state
    stopEngine();

    logData({
        title: `Starting stateful engine (every: ${every}, during: ${during})`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });

    isRunning = true;

    // Parse intervals in miliseconds
    const everyMs = parseTimeOption(every);

    // Setup timeout if it's not "until_finishing_jobs"
    if (during !== 'until_finishing_jobs') {
        const duringMs = parseTimeOption(during);

        timeoutId = global.setTimeout(() => {
            logData({
                title: `Stateful engine: Time limit of ${during} reached, stopping engine`,
                layer: 'queue_jobs',
                type: 'info',
                timeStamp: true,
            });

            stopEngine();
        }, duringMs);
    }

    // Setup interval
    intervalId = global.setInterval(() => {
        void checkAndProcessJobs();
    }, everyMs);

    // Run immediate check and processing
    void checkAndProcessJobs();
}
