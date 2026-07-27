import { getPrisma } from './connection';
import { JobQueue, JobStatus } from '@prisma/client';

const claimPendingJob = async (): Promise<JobQueue | null> => {
    const prisma = getPrisma();

    return await prisma.$transaction(async transaction => {
        const job = await transaction.jobQueue.findFirstOrThrow({
            where: { status: JobStatus.pending },
            orderBy: { created_at: 'asc' },
            take: 1,
        });

        if (!job || job.status !== JobStatus.pending) {
            return null;
        }

        await transaction.jobQueue.update({
            where: { id: job.id },
            data: {
                status: JobStatus.processing,
                attempts: { increment: 1 },
            },
        });

        return job;
    });
};

export default claimPendingJob;
