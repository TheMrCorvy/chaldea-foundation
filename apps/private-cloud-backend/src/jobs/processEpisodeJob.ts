import { logData } from '@salvatore.hakase/log-data';
import type { JobRow } from '../database/utils';
import markJobDone from '../database/markJobDone';
import markJobFailed from '../database/markJobFailed';
import { MisakaNetwork } from '../services/misaka_network';
import { Episode } from '@repo/type-definitions';

const processEpisodeJob = async (job: JobRow): Promise<void> => {
    const payload = job.payload as unknown as Episode;

    logData({
        title: `Processing episode job: ${payload.display_name}`,
        data: { jobId: job.id, entry: payload },
        layer: 'queue_jobs',
        type: 'info',
        addSpaceAfter: true,
        addSeparatorAfter: true,
        timeStamp: true,
    });

    try {
        const processingPower = new MisakaNetwork();
        await processingPower.processEpisode({ entry: payload });
        await markJobDone(job.id);
    } catch (err) {
        logData({
            title: `Error processing episode job: ${payload.display_name}`,
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
