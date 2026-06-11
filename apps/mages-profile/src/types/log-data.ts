import "@salvatore.hakase/log-data";
import { FeatureNames } from "@salvatore.hakase/log-data";

declare module "@salvatore.hakase/log-data" {
    export interface LayersAvailable {
        strapi: "strapi";
        globe: "globe";
        audio: "audio";
        ui: "ui";
        cv: "cv";
        navigation: "navigation";
    }
}

export const FeatureFlagsAvailable = {
    ...FeatureNames,
    CONSUME_STRAPI_DATA: "CONSUME_STRAPI_DATA",
} as const;

export type FeatureFlagsAvailable =
    (typeof FeatureFlagsAvailable)[keyof typeof FeatureFlagsAvailable];
