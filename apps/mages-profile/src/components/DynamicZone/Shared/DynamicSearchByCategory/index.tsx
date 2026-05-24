"use client";

import {
    BlogSearchByCategory,
    BlogPost,
} from "@repo/type-definitions/dynamic-page";
import {
    FC,
    useState,
    KeyboardEvent,
    useEffect,
    ChangeEvent,
    useRef,
} from "react";
import {
    Box,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Pagination,
    Card,
    CardMedia,
    CardContent,
    Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import DynamicTitle from "../DynamicTitle";
import useStyles from "./useStyles";
import useCategories from "./useCategories";
import IconComponent from "../../../IconComponent";
import { ApiPostsResponse } from "../DynamicLastPosts";

const chipVariants = {
    hidden: { opacity: 0, scale: 0.85, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.4, ease: "backOut" },
    },
};

const inputVariants = {
    hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
    },
};

const DynamicSearchByCategory: FC<BlogSearchByCategory> = ({
    title,
    posts_count,
}) => {
    const {
        selectedChipStyles,
        unselectedChipStyles,
        root,
        mainChipsContainer,
        chipsContentStyles,
        searchFormContainer,
        searchInputStyles,
        resultsContainer,
        resultCard,
        placeholderImage,
    } = useStyles();

    const { categories, selectedCategory, handleCategoryClick } =
        useCategories();

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
        if (selectedCategory) {
            executeSearchFlow();
        }
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

    return (
        <Box sx={{ ...root }}>
            <Box>
                <DynamicTitle {...title} title={title.title || ""} />
            </Box>
            <Box sx={mainChipsContainer}>
                <Box sx={chipsContentStyles}>
                    <motion.div
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ flexShrink: 0 }}
                    >
                        <Chip
                            onClick={() =>
                                handleCategoryClick("All categories")
                            }
                            size="medium"
                            label="All categories"
                            sx={
                                selectedCategory === "All categories"
                                    ? selectedChipStyles
                                    : unselectedChipStyles
                            }
                        />
                    </motion.div>
                    {categories.map((category) => {
                        return (
                            <motion.div
                                key={category.id}
                                variants={chipVariants}
                                initial="hidden"
                                animate="visible"
                                style={{ flexShrink: 0 }}
                            >
                                <Chip
                                    onClick={() =>
                                        handleCategoryClick(category.name)
                                    }
                                    size="medium"
                                    label={category.name}
                                    sx={
                                        selectedCategory === category.name
                                            ? selectedChipStyles
                                            : unselectedChipStyles
                                    }
                                />
                            </motion.div>
                        );
                    })}
                </Box>
                <Box
                    component={motion.div}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    sx={searchFormContainer}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        sx={searchInputStyles}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleSearch}
                                            edge="end"
                                            sx={{
                                                color: "rgba(178, 221, 255, 0.8)",
                                            }}
                                        >
                                            <IconComponent name="Search" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>
            </Box>

            <motion.div
                variants={{
                    open: {
                        height: "auto",
                        opacity: 1,
                        marginTop: "1rem",
                        transition: { duration: 0.5, staggerChildren: 0.1 },
                    },
                    closed: {
                        height: 0,
                        opacity: 0,
                        marginTop: "0rem",
                        transition: { duration: 0.4 },
                    },
                }}
                initial="closed"
                animate={isResultsOpen ? "open" : "closed"}
                onAnimationComplete={(definition) => {
                    if (definition === "closed") {
                        if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollLeft = 0;
                        }
                        if (pendingSearch) {
                            setPendingSearch(false);
                            runSearch();
                        }
                    }
                }}
                style={{ overflow: "hidden" }}
            >
                <Box sx={resultsContainer} ref={scrollContainerRef}>
                    {posts.length === 0 ? (
                        <Typography
                            sx={{ color: "rgba(255,255,255,0.7)", p: 2 }}
                        >
                            No posts found.
                        </Typography>
                    ) : (
                        posts.map((post) => (
                            <motion.div
                                key={post.documentId || post.slug}
                                variants={{
                                    open: { opacity: 1, y: 0 },
                                    closed: { opacity: 0, y: 20 },
                                }}
                            >
                                <Card sx={resultCard}>
                                    {post.cover_image &&
                                    typeof post.cover_image === "object" &&
                                    "url" in
                                        (post.cover_image as Record<
                                            string,
                                            unknown
                                        >) ? (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={String(
                                                (
                                                    post.cover_image as Record<
                                                        string,
                                                        unknown
                                                    >
                                                ).url
                                            )}
                                            alt={post.title}
                                        />
                                    ) : (
                                        <Box sx={placeholderImage}>
                                            <IconComponent name="Search" />
                                        </Box>
                                    )}
                                    <CardContent>
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: "1rem",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {post.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                color: "rgba(255,255,255,0.7)",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {post.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </Box>
            </motion.div>

            {totalPages > 1 && (
                <span
                    style={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                        display: "flex",
                        marginTop: "2rem",
                    }}
                >
                    <Pagination
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

export default DynamicSearchByCategory;
