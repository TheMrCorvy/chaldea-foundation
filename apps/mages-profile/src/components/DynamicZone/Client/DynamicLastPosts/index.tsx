"use client";

import { dynamicPageFields, dynamicZone } from "@/lib/constants";
import PlatformService from "@repo/platform-service-sdk";
import { DynamicPage } from "@repo/type-definitions/dynamic-page";
import { FC, useEffect, useState } from "react";

type DynamicPageResponse = {
    data?: Array<DynamicPage>;
};

export interface DynamicLastPostsProps {
    apiKey: string;
}

const DynamicLastPosts: FC<DynamicLastPostsProps> = ({ apiKey }) => {
    const [posts, setPosts] = useState<DynamicPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const platformService = new PlatformService();
                platformService.setJWT(apiKey);

                const { data } = (await platformService.call(
                    "aDynamicPageGetADynamicPages",
                    {
                        query: {
                            filters: {
                                slug: {
                                    $startsWith: "blog/",
                                },
                            },
                            fields: dynamicPageFields,
                            populate: {
                                sections: {
                                    on: dynamicZone,
                                },
                            },
                        },
                    }
                )) as { data?: DynamicPageResponse };

                if (!isActive) {
                    return;
                }

                setPosts(data?.data ?? []);
            } catch (fetchError) {
                if (!isActive) {
                    return;
                }

                setError(
                    fetchError instanceof Error
                        ? fetchError.message
                        : "Failed to load dynamic posts"
                );
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void fetchPosts();

        return () => {
            isActive = false;
        };
    }, [apiKey]);

    return (
        <div>
            <h2>Dynamic Last Posts Component</h2>
            {isLoading ? <p>Loading posts...</p> : null}
            {error ? <p>{error}</p> : null}
            {!isLoading && !error ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.slug}>{post.title}</li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default DynamicLastPosts;
