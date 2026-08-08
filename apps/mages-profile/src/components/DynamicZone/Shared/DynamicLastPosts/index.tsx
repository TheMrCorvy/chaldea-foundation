"use client";

import { BlogLastPosts, BlogPost } from "@repo/type-definitions/dynamic-page";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import DynamicTitle from "../DynamicTitle";
import { Box } from "@mui/joy";
import { RequestPostsResponse } from "@/lib/requestPosts";
import LatestPostsLayout from "@/components/LatestPostsLayout";
import Pagination from "@/components/Pagination";

export interface ApiPostsResponse extends RequestPostsResponse {
    error?: string;
}

export interface DynamicLastPostsProps extends BlogLastPosts {
    isMobile?: boolean;
    currentPostSlug: string;
}

const DynamicLastPosts: FC<DynamicLastPostsProps> = ({
    posts_count,
    related_posts,
    title,
    isMobile,
    show_pagination = true,
    currentPostSlug,
}) => {
    const [posts, setPosts] = useState<Array<BlogPost>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/request-posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    posts_count,
                    related_posts,
                    pageNumber,
                    currentPost: currentPostSlug,
                }),
            });

            const data = (await response.json()) as ApiPostsResponse;

            if (!response.ok) {
                let requestError = "Failed to load dynamic posts.";

                if (data.error) {
                    requestError = data.error;
                }

                setError(requestError);
                setIsLoading(false);
                return;
            }

            setPosts(data.data as Array<BlogPost>);
            setTotalPages(data.meta.pagination.pageCount);
            setIsLoading(false);
        };

        void fetchPosts();
    }, [posts_count, related_posts, pageNumber]);

    const handlePageChange = async (
        _event: ChangeEvent<unknown>,
        value: number
    ) => {
        postsContainerRef.current?.scrollTo({
            left: 0,
            behavior: "smooth",
        });

        if (isMobile) {
            await new Promise<void>((resolve) => {
                window.setTimeout(resolve, 900);
            });
        }

        setPageNumber(value);
    };

    return (
        <Box
            component="section"
            sx={{
                marginBottom: "2.5rem",
                display: "flex",
                flexDirection: "column",
                width: { xs: "90vw", md: "100%" },
                maxWidth: "1300px",
                marginInline: "auto",
            }}
        >
            {title && <DynamicTitle {...title} title={title.title as string} />}
            {isLoading && <p>Loading posts...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <LatestPostsLayout posts={posts} />
            {show_pagination && totalPages > 1 && (
                <Pagination
                    pageNumber={pageNumber}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            )}
        </Box>
    );
};

export default DynamicLastPosts;
