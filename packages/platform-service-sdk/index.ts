import * as Real from "./generated-sdk";
import * as Mock from "./generated-mock-sdk";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import {
    RequestDirectory,
    RequestEpisode,
    QueryParams,
} from "@repo/type-definitions";

export { OpenAPI } from "./generated-sdk";

type RealServices = typeof Real;

// Get all service names that end with "Service"
type ServiceName = {
    [K in keyof RealServices]: K extends `${string}Service` ? K : never;
}[keyof RealServices];

// Dynamically get methods for a specific service
type ServiceMethods<T extends ServiceName> = T extends keyof RealServices
    ? keyof RealServices[T]
    : never;

interface CallServiceParameters<T extends ServiceName = ServiceName> {
    service: T;
    method: ServiceMethods<T>;
    queryParams?: QueryParams;
    q?: string;
    requestBody?: {
        data: RequestDirectory | RequestEpisode;
    };
    id?: string;
}

class PlatformService {
    constructor(jwt?: string) {
        if (jwt) {
            Real.OpenAPI.TOKEN = jwt;
        }
    }

    /**
     * Call a service method with optional parameters
     * @param params - The service call parameters
     * @returns The result from the service method
     */
    public call<T extends ServiceName>(params: CallServiceParameters<T>) {
        const useMock = !isFeatureFlagEnabled(FeatureNames.CONSUME_STRAPI_DATA);

        const serviceMap = useMock ? Mock : Real;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const service = (serviceMap as any)[params.service];

        if (!service || typeof service[params.method] !== "function") {
            throw new Error(
                `Method ${String(params.method)} not found in ${params.service}.`
            );
        }

        const httpMethod = this.inferHttpMethod(params.method);

        if (httpMethod === "GET") {
            return service[params.method](
                params.queryParams?.fields,
                params.queryParams?.filters,
                params.q,
                params.queryParams?.pagination,
                params.queryParams?.sort,
                params.queryParams?.populate
            );
        }

        if (httpMethod === "POST") {
            return service[params.method](
                params.queryParams?.fields,
                params.queryParams?.populate,
                params.requestBody
            );
        }

        if (httpMethod === "PUT") {
            if (!params.id) {
                throw new Error(
                    "The ID of the document is required to perform a PUT request."
                );
            }
            return service[params.method](
                params.id,
                params.queryParams?.fields,
                params.queryParams?.populate,
                params.requestBody
            );
        }

        if (httpMethod === "DELETE") {
            if (!params.id) {
                throw new Error(
                    "The ID of the document is required to perform a DELETE request."
                );
            }
            return service[params.method](
                params.id,
                params.queryParams?.fields,
                params.queryParams?.populate,
                params.queryParams?.filters
            );
        }

        throw new Error("The specified HTTP method is not recognized.");
    }

    /**
     * Infer the HTTP method from the method name
     * @param methodName - The name of the method
     * @returns The inferred HTTP method
     */
    private inferHttpMethod(
        methodName: string
    ): "GET" | "POST" | "PUT" | "DELETE" {
        const lowerCase = methodName.toLocaleLowerCase();

        if (lowerCase.includes("get")) {
            return "GET";
        }
        if (lowerCase.includes("post")) {
            return "POST";
        }
        if (lowerCase.includes("put")) {
            return "PUT";
        }
        if (lowerCase.includes("delete")) {
            return "DELETE";
        }

        throw new Error(
            `Unable to infer HTTP method from method name: ${methodName}.`
        );
    }
}

export default PlatformService;
