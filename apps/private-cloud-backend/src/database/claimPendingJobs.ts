import { getPrisma } from './connection';
import { JobQueue, JobStatus } from '@prisma/client';

const claimPendingJobs = async (limit = 5): Promise<JobQueue[]> => {
    const prisma = getPrisma();

    return await prisma.$transaction(async transaction => {
        const jobs = await transaction.jobQueue.findMany({
            where: { status: JobStatus.pending },
            orderBy: { created_at: 'asc' },
            take: limit,
        });

        if (jobs.length === 0) {
            return [];
        }

        const ids = jobs.map(j => j.id);

        await transaction.jobQueue.updateMany({
            where: { id: { in: ids } },
            data: {
                status: JobStatus.processing,
                attempts: { increment: 1 },
            },
        });

        return jobs;
    });
};

export default claimPendingJobs;
