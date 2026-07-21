import { getPrisma } from './connection';
import { FailedJob } from '@prisma/client';

const getFailedJobs = async (): Promise<FailedJob[]> => {
    const prisma = getPrisma();
    return prisma.failedJob.findMany({
        orderBy: {
            failed_at: 'asc',
        },
    });
};
export default getFailedJobs;
