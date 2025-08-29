export enum FeatureNames {
    CONSUME_STRAPI_DATA = "CONSUME_STRAPI_DATA",
    CONSUME_NAS_FILES = "CONSUME_NAS_FILES",
    ENABLE_USERS_LOGIN = "ENABLE_USERS_LOGIN",
    ENABLE_USERS_REGISTER = "ENABLE_USERS_REGISTER",
    LOG_EXTERNAL_HTTP_REQUESTS = "LOG_EXTERNAL_HTTP_REQUESTS",
    LOG_INTERNAL_HTTP_REQUESTS = "LOG_INTERNAL_HTTP_REQUESTS",
    LOG_RESPONSE_EXTERNAL_HTTP_REQUEST = "LOG_RESPONSE_EXTERNAL_HTTP_REQUEST",
    LOG_RESPONSE_BODY_EXTERNAL_HTTP_REQUEST = "LOG_RESPONSE_BODY_EXTERNAL_HTTP_REQUEST",
}

export interface FeatureFlag {
    enabled: boolean;
    feature: FeatureNames;
}

const getFeatureFlags = (): FeatureFlag[] | null => {
    const featureFlagsString = process.env.FEATURE_FLAGS;

    if (!featureFlagsString) {
        return null;
    }

    return JSON.parse(featureFlagsString);
};

export const isFeatureFlagEnabled = (ff: FeatureNames): boolean => {
    const featureFlagList = getFeatureFlags();

    if (!featureFlagList || featureFlagList.length === 0) {
        return false;
    }

    const featureFlag = featureFlagList.find((f) => f.feature === ff);

    if (!featureFlag) return false;

    return featureFlag.enabled;
};
