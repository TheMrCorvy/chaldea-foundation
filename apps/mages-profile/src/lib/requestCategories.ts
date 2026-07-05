import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@salvatore.hakase/log-data";
import { BlogPostCategoryResponse } from "@repo/type-definitions/blog-post-categories";

export interface RequestCategoriesParams {
    apiKey: string;
}

export type RequestCategories = (
    params: RequestCategoriesParams
) => Promise<BlogPostCategoryResponse>;

const requestCategories: RequestCategories = async ({ apiKey }) => {
    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    try {
        const { data } = (await platformService.call(
            "aPostCategoryGetAPostCategories",
            {
                query: {
                    populate: "*",
                    pagination: {
                        pageSize: 100,
                    },
                    filters: {
                        type_of_category: {
                            $eq: "blog_post",
                        },
                    },
                },
            }
        )) as { data?: BlogPostCategoryResponse };

        if (!data || !data.data || data.data.length === 0) {
            logData({
                type: "warn",
                title: "No categories found",
                data,
                layer: "*",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });

            return {
                data: [],
                meta: {
                    pagination: {
                        page: 0,
                        pageSize: 0,
                        pageCount: 0,
                        total: 0,
                    },
                },
            };
        }

        return data;
    } catch (error) {
        logData({
            type: "error",
            title: "Failed to fetch categories",
            data: { error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return {
            data: [],
            meta: {
                pagination: { page: 0, pageSize: 0, pageCount: 0, total: 0 },
            },
        };
    }
};

export default requestCategories;
