"use client";

import { BlogSearchByCategory } from "@repo/type-definitions/dynamic-page";
import {
    Box,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import DynamicTitle from "../DynamicTitle";
import useStyles from "./useStyles";
import useCategories from "./useCategories";
import IconComponent from "../../../IconComponent";
import usePosts from "./usePosts";
import { FC } from "react";
import HorizontalScrollablePosts from "./HorizontalScrollablePosts";
import Pagination from "@/components/Pagination";

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

export interface DynamicSearchByCategoryProps extends BlogSearchByCategory {
    currentPostSlug: string;
}

const DynamicSearchByCategory: FC<DynamicSearchByCategoryProps> = ({
    title,
    posts_count,
    currentPostSlug,
}) => {
    const {
        selectedChipStyles,
        unselectedChipStyles,
        root,
        mainChipsContainer,
        chipsContentStyles,
        searchFormContainer,
        searchInputStyles,
    } = useStyles();

    const { categories, selectedCategory, setSelectedCategory } =
        useCategories();

    const {
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
        setPosts,
        handleSearch,
        runSearch,
        setPageNumber,
    } = usePosts({ posts_count, selectedCategory, currentPostSlug });

    const handleCategoryClick = (categoryName: string) => {
        setPageNumber(1);
        setSelectedCategory(
            categoryName === selectedCategory ? "All categories" : categoryName
        );
    };

    return (
        <Box sx={{ ...root }}>
            <DynamicTitle {...title} title={title.title || ""} />
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

            <HorizontalScrollablePosts
                isOpen={isResultsOpen}
                posts={posts}
                scrollContainerRef={scrollContainerRef}
                onCloseAnimationComplete={() => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollLeft = 0;
                    }
                    if (pendingSearch) {
                        setPosts([]);
                        setPendingSearch(false);
                        runSearch();
                    }
                }}
            />

            <Pagination
                totalPages={totalPages}
                pageNumber={pageNumber}
                handlePageChange={handlePageChange}
            />
        </Box>
    );
};

export default DynamicSearchByCategory;
