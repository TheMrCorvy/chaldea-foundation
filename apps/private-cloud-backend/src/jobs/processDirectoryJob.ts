import { logData } from '@salvatore.hakase/log-data';
import { MisakaNetwork } from '../services/misaka_network';
import type { JobRow } from '../database/utils';
import markJobDone from '../database/markJobDone';
import markJobFailed from '../database/markJobFailed';
import { Directory } from '@repo/type-definitions';

const processDirectoryJob = async (job: JobRow): Promise<void> => {
    const payload = job.payload as unknown as Directory;

    console.log('- - - - - - - - - -');
    console.log(payload);
    console.log('- - - - - - - - - -');

    logData({
        title: `Processing directory job: ${payload.display_name}`,
        data: { jobId: job.id, entry: payload },
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
    });

    try {
        const processingPower = new MisakaNetwork();
        await processingPower.processDirectory({ entry: payload });
        await markJobDone(job.id);
    } catch (err) {
        logData({
            title: `Error processing directory job: ${payload.display_name}`,
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
