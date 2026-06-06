import cron from 'node-cron';
import { processJobs } from '../services/jobProcessor.service';
import { reportFailedJobs } from '../jobs/reportFailedJobs';

export function startCronJobs(): void {
    // Process pending jobs every hour
    cron.schedule('0 * * * *', async () => {
        try {
            await processJobs();
        } catch (err) {
            console.error('[cron] processJobs error:', err);
        }
    });

    // Report failed jobs once a day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            await reportFailedJobs();
        } catch (err) {
            console.error('[cron] reportFailedJobs error:', err);
        }
    });

    console.log('[cron] Cron jobs scheduled');
}
