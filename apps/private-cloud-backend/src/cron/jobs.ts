import cron from 'node-cron';
import { processJobs } from '../services/jobProcessor.service';

export function startCronJobs(): void {
    // Process pending jobs every minute
    cron.schedule('* * * * *', async () => {
        try {
            await processJobs();
        } catch (err) {
            console.error('[cron] processJobs error:', err);
        }
    });

    console.log('[cron] Cron jobs scheduled');
}
