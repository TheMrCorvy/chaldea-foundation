import { logData } from '@repo/shared-utils/log-data';
import { JobRow, markJobDone, markJobFailed } from '../database/jobQueue';
import { Wuphf } from '../services/wuphf';

import { SocialMediaPostJobPayload } from '../services/jobProcessor.service';

const postToSocialMedia = async (job: JobRow): Promise<void> => {
    const { networks, entry } = job.payload as unknown as SocialMediaPostJobPayload;

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
        logData({
            title: 'Published to social media',
            data: { jobId: job.id, results },
            layer: 'webhooks_received',
            type: 'info',
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

        await markJobDone(job.id);
    }
};

export default postToSocialMedia;
