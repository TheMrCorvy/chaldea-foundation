import PlatformService from '@repo/platform-service-sdk';
import { JobQueue } from '@prisma/client';

export type { JobQueue as JobRow };

const getPlatformServiceClient = (): PlatformService | null => {
    const apiKey = process.env.STRAPI_API_KEY;

    if (!apiKey) {
        return null;
    }

    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    return platformService;
};

export default getPlatformServiceClient;
