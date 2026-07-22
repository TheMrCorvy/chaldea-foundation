import { getPrisma } from './connection';
import { logData } from '@salvatore.hakase/log-data';

const deleteJobFromQueue = async (id: number): Promise<void> => {
    const prisma = getPrisma();

    try {
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
