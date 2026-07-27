import { getPrisma } from './connection';
import { logData } from '@salvatore.hakase/log-data';

const deleteJobFromQueue = async (id: number): Promise<void> => {
    const prisma = getPrisma();

    try {
        const job = await prisma.jobQueue.findUnique({
            where: { id },
        });

        if (!job) {
            logData({
                title: `Job ${id} not found in queue`,
                layer: 'queue_jobs',
                type: 'warn',
                timeStamp: true,
            });

            return;
        }

        await prisma.jobQueue.delete({
            where: { id },
        });

        logData({
            title: `Successfully deleted job ${id} from queue`,
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
        });
    } catch (err) {
        logData({
            title: `Error or job not found when deleting job ${id} from queue`,
            data: { error: String(err) },
            layer: 'queue_jobs',
            type: 'error',
            timeStamp: true,
        });
        throw err;
    }
};

export default deleteJobFromQueue;
