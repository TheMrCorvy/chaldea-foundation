import cron from 'node-cron';
import { processJobs } from '../services/jobProcessor.service';
import { logData } from '@salvatore.hakase/log-data';

export function startCronJobs(): void {
    // Process pending jobs every hour
    cron.schedule('0 * * * *', async () => {
        try {
            await processJobs();
        } catch (err) {
            logData({
                title: 'Error processing jobs',
                data: err,
                layer: '*',
                type: 'error',
                timeStamp: true,
            });
        }
    });

    logData({
        title: 'Cron jobs scheduled',
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });
}
