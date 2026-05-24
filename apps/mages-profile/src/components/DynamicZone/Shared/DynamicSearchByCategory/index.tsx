"use client";

import { BlogSearchByCategory } from "@repo/type-definitions/dynamic-page";
import { FC, useState, KeyboardEvent, useEffect } from "react";
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

const DynamicSearchByCategory: FC<BlogSearchByCategory> = ({ title }) => {
    const {
        selectedChipStyles,
        unselectedChipStyles,
        root,
        mainChipsContainer,
        chipsContentStyles,
        searchFormContainer,
        searchInputStyles,
    } = useStyles();

    const { categories, selectedCategory, handleCategoryClick } =
        useCategories();

    const [searchTerm, setSearchTerm] = useState("");

    const performSearch = async (
        currentSearchTerm: string,
        currentCategory: string
    ) => {
        try {
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
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.clear();
                console.log("Search results:", data);
            }
        } catch (error) {
            console.error("Error fetching searched posts:", error);
        }
    };

    const handleSearch = () => {
        performSearch(searchTerm, selectedCategory);
    };

    useEffect(() => {
        if (selectedCategory) {
            performSearch(searchTerm, selectedCategory);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
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
        </Box>
    );
};

export default DynamicSearchByCategory;
