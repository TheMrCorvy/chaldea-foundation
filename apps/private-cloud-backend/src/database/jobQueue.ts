import { getPrisma } from './connection';
import { Prisma, JobQueue, JobStatus } from '@prisma/client';

export type { JobQueue as JobRow };

export async function addJobToQueue(type: string, payload: unknown): Promise<void> {
    const prisma = getPrisma();

    await prisma.jobQueue.create({
        data: {
            type,
            payload: payload as Prisma.InputJsonValue,
        },
    });
}

/**
 * Claims up to `limit` pending jobs by marking them as 'processing'.
 */
export async function claimPendingJobs(limit = 5): Promise<JobQueue[]> {
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
}

export async function markJobDone(id: number): Promise<void> {
    const prisma = getPrisma();

    await prisma.$transaction(async tx => {
        const job = await tx.jobQueue.findUnique({
            where: { id },
        });

        if (!job) {
            throw new Error(`Job with id ${id} not found in queue`);
        }

        await tx.finishedJob.create({
            data: {
                type: job.type,
                payload: job.payload as Prisma.InputJsonValue,
                attempts: job.attempts,
                created_at: job.created_at,
            },
        });

        await tx.jobQueue.delete({
            where: { id },
        });
    });
}

export async function markJobFailed(id: number, error: string): Promise<void> {
    const prisma = getPrisma();

    await prisma.$transaction(async tx => {
        const job = await tx.jobQueue.findUnique({
            where: { id },
        });

        if (!job) {
            throw new Error(`Job with id ${id} not found in queue`);
        }

        await tx.failedJob.create({
            data: {
                type: job.type,
                payload: job.payload as Prisma.InputJsonValue,
                attempts: job.attempts,
                last_error: error,
                created_at: job.created_at,
            },
        });

        await tx.jobQueue.delete({
            where: { id },
        });
    });
}
