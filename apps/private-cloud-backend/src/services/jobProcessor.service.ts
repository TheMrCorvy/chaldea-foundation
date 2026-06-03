import { logData } from '@repo/shared-utils/log-data';
import { claimPendingJobs, markJobDone, markJobFailed } from '../database/jobQueue';
import { Wuphf } from './wuphf';
import type { SocialMediaEntry } from '../types/strapiWebhook.types';
import { SocialNetworks } from './wuphf/types';

export const JOB_TYPES = {
    SOCIAL_MEDIA_POST: 'social_media_post',
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export interface SocialMediaPostJobPayload {
    networks: SocialNetworks[];
    entry: SocialMediaEntry;
}

export async function processJobs(): Promise<void> {
    const jobs = await claimPendingJobs();

    for (const job of jobs) {
        try {
            if (job.type === JOB_TYPES.SOCIAL_MEDIA_POST) {
                const { networks, entry } = job.payload as SocialMediaPostJobPayload;

                const wuphf = new Wuphf();
                const results = await wuphf.post(networks, entry);

                const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

                if (failures.length > 0) {
                    const reasons = failures.map(r => String(r.reason)).join('; ');

                    failures.forEach(r =>
                        logData({
                            title: 'Failed to publish to social media',
                            data: { reason: r.reason },
                            layer: 'webhooks_received',
                            type: 'error',
                            addSeparatorAfter: true,
                            addSpaceAfter: true,
                            timeStamp: true,
                        })
                    );

                    await markJobFailed(job.id, reasons);
                } else {
                    await markJobDone(job.id);

                    logData({
                        title: 'Published to social media',
                        data: { jobId: job.id, results },
                        layer: 'webhooks_received',
                        type: 'info',
                        addSeparatorAfter: true,
                        addSpaceAfter: true,
                        timeStamp: true,
                    });
                }
            } else {
                await markJobFailed(job.id, `Unknown job type: ${job.type}`);
                console.warn(`[jobProcessor] Unknown job type "${job.type}" for job ${job.id}`);
            }
        } catch (err) {
            await markJobFailed(job.id, String(err));
            console.error(`[jobProcessor] Job ${job.id} threw an error:`, err);
        }
    }
}
