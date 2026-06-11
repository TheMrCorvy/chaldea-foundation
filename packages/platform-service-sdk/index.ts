import * as Real from "./generated-sdk";
import * as Mock from "./generated-mock-sdk";
import { client } from "./generated-sdk/client.gen";
import { FeatureFlagsAvailable } from "@repo/config/feature-flags";
import { isFeatureFlagEnabled } from "@repo/shared-utils/feature-flags";
import type { QueryParams } from "@repo/type-definitions";
import { queryBuilder } from "./queryBuilder";

export { client } from "./generated-sdk/client.gen";
export type * from "./generated-sdk/types.gen";

type SDKFunctions = typeof Real;
type MockFunctions = typeof Mock;
type FunctionNames = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof SDKFunctions]: SDKFunctions[K] extends (...args: any[]) => any
        ? K
        : never;
}[keyof SDKFunctions];
interface BaseCallParameters {
    query?: QueryParams;
    path?: Record<string, string | number>;
    body?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

class PlatformService {
    private sdk: SDKFunctions | MockFunctions;
    private useMock: boolean;

    constructor(jwt?: string) {
        this.useMock =
            !isFeatureFlagEnabled(FeatureFlagsAvailable.CONSUME_STRAPI_DATA) ||
            process.env.NODE_ENV === "test";

        this.sdk = this.useMock ? Mock : Real;

        if (!this.useMock) {
            if (jwt) {
                client.setConfig({
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                    querySerializer: queryBuilder,
                });
            } else {
                client.setConfig({
                    headers: {
                        Authorization: null,
                    },
                    querySerializer: queryBuilder,
                });
            }
        }
    }

    public call<T extends FunctionNames>(
        method: T,
        options?: BaseCallParameters
    ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sdkMethod = (this.sdk as any)[method];

        if (typeof sdkMethod !== "function") {
            throw new Error(`Method ${String(method)} not found in SDK.`);
        }

        return sdkMethod(options);
    }

    public setJWT(jwt: string): void {
        if (!this.useMock) {
            client.setConfig({
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                querySerializer: queryBuilder,
            });
        }
    }

    public clearJWT(): void {
        if (!this.useMock) {
            client.setConfig({
                headers: {
                    Authorization: null,
                },
                querySerializer: queryBuilder,
            });
        }
    }

    public setApiToken(apiToken: string): void {
        if (!this.useMock) {
            client.setConfig({
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                },
                querySerializer: queryBuilder,
            });
        }
    }

    public setBaseUrl(baseUrl: string): void {
        if (!this.useMock) {
            client.setConfig({
                baseUrl,
                querySerializer: queryBuilder,
            });
        }
    }
}

export default PlatformService;
