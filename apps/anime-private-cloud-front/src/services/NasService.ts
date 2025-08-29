import NasSDK from "@/lib/NasSDK";
import { FeatureNames, isFeatureFlagEnabled } from "./featureFlagService";
import { type NasSDK as INasSDK } from "@/types/NasSDK";
import NasMockSDK from "@/lib/NasMockSDK";

export const NasService = (): INasSDK => {
    if (
        process.env.NODE_ENV === "test" ||
        !isFeatureFlagEnabled(FeatureNames.CONSUME_NAS_FILES)
    ) {
        return new NasMockSDK();
    }

    if (!process.env.NAS_API_HOST) {
        throw new Error("An error has ocurred: NAS API Host was not found.");
    }

    return new NasSDK();
};
