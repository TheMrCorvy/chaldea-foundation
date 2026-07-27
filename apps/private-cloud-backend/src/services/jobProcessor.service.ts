import claimPendingJob from '../database/claimPendingJob';
import markJobFailed from '../database/markJobFailed';
import type { SocialMediaEntry } from '../types/strapiWebhook.types';
import { SocialNetworks } from './wuphf/types';
import postToSocialMedia from '../jobs/postToSocialMedia';
import processEpisodeJob from '../jobs/processEpisodeJob';
import processDirectoryJob from '../jobs/processDirectoryJob';
import { logData } from '@salvatore.hakase/log-data';

export const JOB_TYPES = {
    SOCIAL_MEDIA_POST: 'social_media_post',
    RUN_BACKUPS: 'run_backups',
    PROCESS_VIDEO: 'process_video',
    PROCESS_EPISODE: 'process_episode',
    PROCESS_DIRECTORY: 'process_directory',
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export interface SocialMediaPostJobPayload {
    networks: SocialNetworks[];
    entry: SocialMediaEntry;
}

export async function processJobs(): Promise<void> {
    const job = await claimPendingJob();

    if (!job) {
        return;
    }

    try {
        if (job.type === JOB_TYPES.SOCIAL_MEDIA_POST) {
            await postToSocialMedia(job);
            return;
        }

        if (job.type === JOB_TYPES.PROCESS_EPISODE) {
            await processEpisodeJob(job);
            return;
        }

        if (job.type === JOB_TYPES.PROCESS_DIRECTORY) {
            await processDirectoryJob(job);
            return;
        }

        await markJobFailed(job.id, `Unknown job type: ${job.type}`);

        logData({
            title: 'Unknown job type',
            data: { jobId: job.id, jobType: job.type },
            layer: 'queue_jobs',
            type: 'warn',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });
    } catch (err) {
        await markJobFailed(job.id, String(err));

        logData({
            title: 'Job processing error',
            data: { jobId: job.id, error: err },
            layer: '*',
            type: 'error',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });
    }
}
