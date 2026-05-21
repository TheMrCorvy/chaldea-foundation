import PlatformService from "@repo/platform-service-sdk";
import {
    DynamicPageResponse,
    LayoutToolChip,
    Post,
} from "@repo/type-definitions/dynamic-page";
import { dynamicPageFields, dynamicZone } from "./constants";
import { logData } from "@repo/shared-utils/log-data";
import { QueryParams } from "@repo/type-definitions";

export interface RequestPostsParams {
    posts_count: number;
    apiKey: string;
    related_posts?: Array<LayoutToolChip> | null;
}

export type RequestPosts = (params: RequestPostsParams) => Promise<Array<Post>>;

export const requestPosts: RequestPosts = async ({
    apiKey,
    posts_count,
    related_posts,
}) => {
    const platformService = new PlatformService();
    platformService.setJWT(apiKey);

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
            });
        }
    }

    queryParams = {
        filters: {
            slug: {
                $startsWith: "blog/",
            },
        },
        pagination: {
            pageSize: posts_count || 5,
        },
    };

    return await fetchPosts({ apiKey, queryParams });
};

interface FetchPostsParams {
    apiKey: string;
    queryParams: QueryParams;
}

type FetchPosts = (params: FetchPostsParams) => Promise<Array<Post>>;

const fetchPosts: FetchPosts = async ({ apiKey, queryParams }) => {
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

        return [];
    }
};

const prettifyPosts = (data: DynamicPageResponse | undefined): Array<Post> => {
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
        return [];
    }

    const posts: Post[] = data.data.map((post) => ({
        documentId: post.documentId,
        title: post.title,
        slug: post.slug,
        description: post.description,
        cover_image: null,
    }));

    return posts;
};
