import PlatformService from "@repo/platform-service-sdk";
import {
    DynamicPageResponse,
    LayoutToolChip,
    Pagination,
    BlogPost,
} from "@repo/type-definitions/dynamic-page";
import { dynamicPageFields, populateDynamicPageRelations } from "./constants";
import { QueryParams } from "@repo/type-definitions";
import { logData } from "@salvatore.hakase/log-data";

export interface RequestPostsParams {
    posts_count: number;
    apiKey: string;
    related_posts?: Array<LayoutToolChip> | null;
    pageNumber: number;
    category?: string;
    searchQuery?: string;
}

export interface RequestPostsResponse {
    data: Array<BlogPost>;
    meta: {
        pagination: Pagination;
    };
}

export interface MetadataCoverImage {
    url: string;
    alt: string;
}

export type RequestPosts = (
    params: RequestPostsParams
) => Promise<RequestPostsResponse>;

export const requestPosts: RequestPosts = async ({
    apiKey,
    posts_count,
    related_posts,
    pageNumber,
    category,
    searchQuery,
}) => {
    let queryParams: QueryParams;

    if (category || searchQuery) {
        let filters: Record<string, unknown> = {
            slug: {
                $startsWith: `blog/`,
            },
        };

        if (searchQuery && (!category || category === "All categories")) {
            filters = {
                ...filters,
                $or: [
                    { title: { $containsi: searchQuery } },
                    { description: { $containsi: searchQuery } },
                ],
            };
        } else if (category && category !== "All categories" && searchQuery) {
            filters = {
                ...filters,
                categories: {
                    name: {
                        $eq: category,
                    },
                },
                $or: [
                    { title: { $containsi: searchQuery } },
                    { description: { $containsi: searchQuery } },
                ],
            };
        } else if (category && category !== "All categories" && !searchQuery) {
            filters = {
                ...filters,
                categories: {
                    name: {
                        $eq: category,
                    },
                },
            };
        }

        queryParams = {
            filters,
            sort: ["updatedAt:desc"],
            pagination: {
                pageSize: posts_count || 5,
            },
        };

        return await fetchPosts({
            apiKey,
            queryParams,
            pageNumber,
            posts_count,
        });
    }

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
                sort: ["updatedAt:desc"],
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
                    fields: Array.from(
                        new Set([...dynamicPageFields, "updatedAt"])
                    ),
                    populate: populateDynamicPageRelations,
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
        cover_image: (post.metadata?.cover_image as MetadataCoverImage) || null,
        categories: post.categories,
        updatedAt: post.updatedAt,
    }));

    return {
        data: posts,
        meta: data.meta || {
            pagination: { page: 0, pageSize: 0, pageCount: 0, total: 0 },
        },
    };
};
