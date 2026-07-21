import { logData } from '@salvatore.hakase/log-data';
import type { JobRow } from '../database/utils';
import markJobDone from '../database/markJobDone';
import markJobFailed from '../database/markJobFailed';
import { MisakaNetwork } from '../services/misaka_network';
import type { ProcessEpisodeJobPayload } from '../services/jobProcessor.service';

const processEpisodeJob = async (job: JobRow): Promise<void> => {
    const { entry } = job.payload as unknown as ProcessEpisodeJobPayload;

    logData({
        title: `Processing episode job: ${entry.display_name}`,
        data: { jobId: job.id, entry },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    try {
        const processingPower = new MisakaNetwork();
        await processingPower.processEpisode({ entry });
        await markJobDone(job.id);
    } catch (err) {
        logData({
            title: `Error processing episode job: ${entry.display_name}`,
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

export default processEpisodeJob;
