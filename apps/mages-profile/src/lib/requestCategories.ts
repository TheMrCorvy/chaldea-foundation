import PlatformService from "@repo/platform-service-sdk";

export interface RequestCategoriesParams {
    apiKey: string;
}

export type RequestCategories = (
    params: RequestCategoriesParams
) => Promise<any>;

const requestCategories: RequestCategories = async ({ apiKey }) => {
    const platformService = new PlatformService();
    platformService.setJWT(apiKey);
};

export default requestCategories;
