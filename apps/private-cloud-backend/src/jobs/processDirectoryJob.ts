import { logData } from '@salvatore.hakase/log-data';
import { JobRow, markJobDone, markJobFailed } from '../database/jobQueue';
import { MisakaNetwork } from '../services/misaka_network';
import type { ProcessDirectoryJobPayload } from '../services/jobProcessor.service';

const processDirectoryJob = async (job: JobRow): Promise<void> => {
    const { entry } = job.payload as unknown as ProcessDirectoryJobPayload;

    logData({
        title: `Processing directory job: ${entry.display_name}`,
        data: { jobId: job.id, entry },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    try {
        const processingPower = new MisakaNetwork();
        await processingPower.processDirectory({ entry });
        await markJobDone(job.id);
    } catch (err) {
        logData({
            title: `Error processing directory job: ${entry.display_name}`,
            data: { jobId: job.id, error: String(err) },
            layer: 'queue_jobs',
            type: 'error',
            addSpaceAfter: true,
            addSeparatorAfter: true,
            timeStamp: true,
        });

        await markJobFailed(job.id, String(err));
    }
};

export default processDirectoryJob;
