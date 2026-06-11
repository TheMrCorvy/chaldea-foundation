import { logData } from '@salvatore.hakase/log-data';
import { VerifyEnvResult } from '../../types/dbInit';

const envVerification = (): VerifyEnvResult => {
    const secureBasePath = process.env.SECURE_BASE_PATH || '';
    const initiumIter: string[] = process.env.INITIAL_PATH ? JSON.parse(process.env.INITIAL_PATH) : [];
    const excludedParents: string[] = process.env.EXCLUDED_PARENTS ? JSON.parse(process.env.EXCLUDED_PARENTS) : [];
    const strapiApiKey = process.env.STRAPI_API_KEY;

    if (!initiumIter || initiumIter.length < 1 || !strapiApiKey || !excludedParents || !secureBasePath) {
        logData({
            title: 'Some env variables are not set',
            data: {
                initiumIter,
                strapiApiKey,
                excludedParents,
                secureBasePath,
            },
            type: 'error',
            layer: '*',
            addSpaceAfter: true,
            addSpaceBefore: true,
            addSeparatorAfter: true,
        });
        throw new Error('Environment variables are not set.');
    }

    return {
        secureBasePath,
        initiumIter,
        excludedParents,
        strapiApiKey,
    };
};

export default envVerification;
