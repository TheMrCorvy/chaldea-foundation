import PlatformService from "@repo/platform-service-sdk";
import {
    DynamicPageResponse,
    LayoutToolChip,
    Pagination,
    BlogPost,
} from "@repo/type-definitions/dynamic-page";
import { dynamicPageFields, dynamicZone } from "./constants";
import { logData } from "@repo/shared-utils/log-data";
import { QueryParams } from "@repo/type-definitions";

export interface RequestPostsParams {
    posts_count: number;
    apiKey: string;
    related_posts?: Array<LayoutToolChip> | null;
    pageNumber: number;
}

export interface RequestPostsResponse {
    data: Array<BlogPost>;
    meta: {
        pagination: Pagination;
    };
}

export type RequestPosts = (
    params: RequestPostsParams
) => Promise<RequestPostsResponse>;

export const requestPosts: RequestPosts = async ({
    apiKey,
    posts_count,
    related_posts,
    pageNumber,
}) => {
    let queryParams: QueryParams;

    if (related_posts && related_posts.length > 0) {
        const relatedSlugs = related_posts
            .map((chip) => chip.title as string)
            .filter(Boolean);

        if (relatedSlugs.length > 0) {
            queryParams = {
                filters: {
                    slug: {
                        $in: relatedSlugs,
                    },
                },
            };

            return await fetchPosts({
                apiKey,
                queryParams,
                pageNumber,
                posts_count,
            });
        }
    }

    queryParams = {
        filters: {
            slug: {
                $startsWith: "blog/",
            },
        },
        sort: ["updatedAt:desc"],
        pagination: {
            pageSize: posts_count || 5,
        },
    };

    return await fetchPosts({ apiKey, queryParams, pageNumber, posts_count });
};

interface FetchPostsParams {
    apiKey: string;
    queryParams: QueryParams;
    pageNumber: number;
    posts_count: number;
}

type FetchPosts = (params: FetchPostsParams) => Promise<RequestPostsResponse>;

const fetchPosts: FetchPosts = async ({
    apiKey,
    queryParams,
    pageNumber,
    posts_count,
}) => {
    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

    try {
        const { data } = (await platformService.call(
            "aDynamicPageGetADynamicPages",
            {
                query: {
                    ...queryParams,
                    fields: dynamicPageFields,
                    populate: {
                        sections: {
                            on: dynamicZone,
                        },
                    },
                    pagination: {
                        page: pageNumber,
                        pageSize: posts_count,
                    },
                },
            }
        )) as { data?: DynamicPageResponse };

        return prettifyPosts(data);
    } catch (error) {
        logData({
            type: "error",
            title: "Failed to fetch posts",
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

const prettifyPosts = (
    data: DynamicPageResponse | undefined
): RequestPostsResponse => {
    if (!data || !data.data || data.data.length === 0) {
        logData({
            type: "warn",
            title: "No latest posts found",
            data,
            layer: "external_http_requests",
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

    const posts: BlogPost[] = data.data.map((post) => ({
        documentId: post.documentId,
        title: post.title,
        slug: post.slug,
        description: post.description,
        cover_image: null,
    }));

    return {
        data: posts,
        meta: data.meta || {
            pagination: { page: 0, pageSize: 0, pageCount: 0, total: 0 },
        },
    };
};
