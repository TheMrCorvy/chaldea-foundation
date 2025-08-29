import { FeatureNames, isFeatureFlagEnabled } from "./featureFlagService";
import StrapiMockSDK from "@/lib/StrapiMockSDK";
import StrapiSDK from "@/lib/StrapiSDK";
import { type StrapiSDK as IStrapiSDK } from "@/types/StrapiSDK";

export const StrapiService = (): IStrapiSDK => {
    if (
        process.env.NODE_ENV === "test" ||
        !isFeatureFlagEnabled(FeatureNames.CONSUME_STRAPI_DATA)
    ) {
        return StrapiMockSDK;
    }

    if (!process.env.STRAPI_API_HOST) {
        throw new Error("An error has ocurred: Strapi API Host was not found.");
    }

    return new StrapiSDK();
};
