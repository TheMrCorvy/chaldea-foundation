import { type UserConfig } from "@hey-api/openapi-ts";

const config: UserConfig = {
    input: "./specs/spec.json",
    output: {
        path: "./packages/platform-service-sdk/generated-sdk",
        format: "prettier",
    },
    plugins: [
        {
            name: "@hey-api/typescript",
        },
        {
            name: "@hey-api/sdk",
            asClass: false,
        },
        {
            name: "@hey-api/client-fetch",
            runtimeConfigPath:
                "./packages/platform-service-sdk/runtime-config.ts",
        },
    ],
};

export default config;
