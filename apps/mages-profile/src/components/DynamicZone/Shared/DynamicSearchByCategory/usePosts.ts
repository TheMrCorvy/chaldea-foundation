import { BlogPost } from "@repo/type-definitions/dynamic-page";
import { useState, KeyboardEvent, useEffect, ChangeEvent, useRef } from "react";
import { ApiPostsResponse } from "../DynamicLastPosts";

export interface UsePostParams {
    posts_count: number;
    selectedCategory: string;
    currentPostSlug: string;
}

const usePosts = ({
    posts_count,
    selectedCategory,
    currentPostSlug,
}: UsePostParams) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [pendingSearch, setPendingSearch] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const performSearch = async (
        currentSearchTerm: string,
        currentCategory: string,
        currentPage: number
    ) => {
        const response = await fetch("/api/request-posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                category:
                    currentCategory === "All categories"
                        ? undefined
                        : currentCategory,
                searchQuery: currentSearchTerm.trim() || undefined,
                pageNumber: currentPage,
                posts_count,
                currentPost: currentPostSlug,
            }),
        });

        if (response.ok) {
            const data = (await response.json()) as ApiPostsResponse;
            return data;
        }

        return {
            data: [],
            meta: {
                pagination: {
                    page: 1,
                    pageSize: posts_count || 5,
                    pageCount: 1,
                    total: 0,
                },
            },
        };
    };

    const runSearch = async () => {
        const data = await performSearch(
            searchTerm,
            selectedCategory,
            pageNumber
        );

        setPosts((data.data as BlogPost[]) || []);
        setTotalPages(data.meta?.pagination?.pageCount || 1);
        setIsResultsOpen(true);
    };

    const executeSearchFlow = () => {
        if (isResultsOpen) {
            setPendingSearch(true);
            setIsResultsOpen(false);
        } else {
            runSearch();
        }
    };

    const handleSearch = () => {
        executeSearchFlow();
    };

    useEffect(() => {
        const triggerSearchFlow = async () => {
            if (selectedCategory) {
                executeSearchFlow();
            }
        };

        triggerSearchFlow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, pageNumber]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handlePageChange = async (
        _event: ChangeEvent<unknown>,
        value: number
    ) => {
        setPageNumber(value);
    };

    return {
        searchTerm,
        setSearchTerm,
        handleKeyDown,
        posts,
        isResultsOpen,
        pendingSearch,
        setPendingSearch,
        pageNumber,
        totalPages,
        handlePageChange,
        scrollContainerRef,
        handleSearch,
        runSearch,
        setPosts,
        setPageNumber,
    };
};

export default usePosts;
