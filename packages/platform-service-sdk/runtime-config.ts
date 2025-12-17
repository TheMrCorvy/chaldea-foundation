import type { CreateClientConfig } from "./generated-sdk/client.gen";
import { queryBuilder } from "./queryBuilder";

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: process.env.STRAPI_BASE_URL || "http://localhost:1337/api",
    querySerializer: queryBuilder,
});
