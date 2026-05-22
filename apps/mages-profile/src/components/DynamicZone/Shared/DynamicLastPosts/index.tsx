"use client";

import { BlogLastPosts, Post } from "@repo/type-definitions/dynamic-page";
import { ChangeEvent, FC, useEffect, useState } from "react";
import DynamicTitle from "../DynamicTitle";
import PostCard from "./PostCard";
import { Box } from "@mui/joy";
import { RequestPostsResponse } from "@/lib/requestPosts";
import { Pagination as MUIPagination } from "@mui/material";

interface ApiPostsResponse extends RequestPostsResponse {
    error?: string;
}

const DynamicLastPosts: FC<BlogLastPosts> = ({
    posts_count,
    related_posts,
    title_color,
    title_size,
    title_text_align,
    link_icon_color,
    popover,
    animation_cycles,
    title,
    id,
    link_to_page,
}) => {
    const [posts, setPosts] = useState<Array<Post>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

            setPosts(data.data as Array<Post>);
            setTotalPages(data.meta.pagination.pageCount);
            setIsLoading(false);
        };

        void fetchPosts();
    }, [posts_count, related_posts, pageNumber]);

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
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
            <DynamicTitle
                id={id}
                title={title as string}
                color={title_color}
                size={title_size}
                text_align={title_text_align || "left"}
                link_icon_color={link_icon_color}
                popover={popover}
                cycles={animation_cycles}
                link_to_page={link_to_page}
            />
            {isLoading && <p>Loading posts...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Box
                sx={{
                    marginTop: "1.5rem",
                    display: "flex",
                    gap: { xs: "1rem", md: "2.5rem" },
                    flexDirection: "row",
                    justifyContent: { xs: "flex-start", md: "space-around" },
                    flexWrap: { xs: "nowrap", md: "wrap" },
                    overflowX: { xs: "auto", md: "visible" },
                    pt: 6,
                    pb: { xs: 3, md: 0 },
                    scrollSnapType: { xs: "x mandatory", md: "none" },
                    WebkitOverflowScrolling: "touch",
                    "& > *": {
                        flexShrink: 0,
                        scrollSnapAlign: { xs: "start", md: "none" },
                    },
                }}
            >
                {posts.map((post, index) => (
                    <PostCard key={post.documentId} post={post} index={index} />
                ))}
            </Box>
            {totalPages > 1 && (
                <span
                    style={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                        display: "flex",
                        marginTop: "5rem",
                    }}
                >
                    <MUIPagination
                        page={pageNumber}
                        count={totalPages}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                color: "#eeeeee",
                            },
                            "& .Mui-selected": {
                                color: "#fff",
                            },
                        }}
                    />
                </span>
            )}
        </Box>
    );
};

export default DynamicLastPosts;
