"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { BlogPost } from "@repo/type-definitions/dynamic-page";
import React, { FC, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PostImagePlaceHolder from "../PostImagePlaceHolder";

const StyledTypography = styled(Typography)({
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
});

const TitleTypography = styled(Typography)(() => ({
    position: "relative",
    textDecoration: "none",
    "&:hover": { cursor: "pointer" },
    "& .arrow": {
        visibility: "hidden",
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        opacity: 0,
        transition: "opacity 0.3s ease, visibility 0.3s ease",
    },
    "&:hover .arrow": {
        visibility: "visible",
        opacity: 1,
    },
    "&:focus-visible": {
        outline: "3px solid",
        outlineColor: "hsla(210, 98%, 48%, 0.5)",
        outlineOffset: "3px",
        borderRadius: "8px",
    },
    "&::before": {
        content: '""',
        position: "absolute",
        width: 0,
        height: "1px",
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(25,118,210, 0.6)",
        transition: "width 0.3s ease, opacity 0.3s ease",
    },
    "&:hover::before": {
        width: "100%",
    },
}));

export interface LatestPostsLayoutProps {
    posts: BlogPost[];
}

const LatestPostsLayout: FC<LatestPostsLayoutProps> = ({ posts }) => {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(
        null
    );

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <Grid
            container
            spacing={4}
            columns={12}
            sx={{ my: 4 }}
            justifyContent="center"
        >
            {posts.map((post, index) => (
                <Grid
                    key={index}
                    size={{ xs: 12, sm: 6, lg: 4 }}
                    sx={{
                        mt: 4,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{
                            duration: 0.6,
                            delay: (index % 12) * 0.1,
                            ease: "easeOut",
                        }}
                        style={{ height: "100%" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: 1,
                                height: "100%",
                            }}
                        >
                            {!post.cover_image ? (
                                <PostImagePlaceHolder roundedBorders />
                            ) : (
                                <img
                                    src={post.cover_image.url}
                                    alt={post.title}
                                    style={{
                                        height: "150px",
                                        width: "100%",
                                        borderRadius: "8px",
                                    }}
                                />
                            )}
                            <Link
                                href={"/" + post.slug}
                                target="_self"
                                style={{ textDecoration: "none" }}
                            >
                                <TitleTypography
                                    gutterBottom
                                    variant="h6"
                                    onFocus={() => handleFocus(index)}
                                    onBlur={handleBlur}
                                    tabIndex={0}
                                    className={
                                        focusedCardIndex === index
                                            ? "Mui-focused"
                                            : ""
                                    }
                                    sx={{ color: "common.white" }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 1,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {post.categories?.map(
                                            (category, categoryIndex) => (
                                                <React.Fragment
                                                    key={
                                                        category.documentId +
                                                        categoryIndex
                                                    }
                                                >
                                                    <Typography
                                                        gutterBottom
                                                        variant="caption"
                                                        component="div"
                                                        sx={{
                                                            color: "grey.400",
                                                        }}
                                                    >
                                                        {category.name}
                                                    </Typography>
                                                    {categoryIndex <
                                                        post.categories!
                                                            .length -
                                                            1 && (
                                                        <Divider
                                                            orientation="vertical"
                                                            flexItem
                                                            sx={{
                                                                borderColor:
                                                                    "grey.700",
                                                                my: 0.5,
                                                            }}
                                                        />
                                                    )}
                                                </React.Fragment>
                                            )
                                        )}
                                    </Box>
                                    {post.title}
                                    <ArrowForwardIosIcon
                                        className="arrow"
                                        color="primary"
                                        sx={{ fontSize: "1rem" }}
                                    />
                                </TitleTypography>
                            </Link>
                            <StyledTypography
                                variant="body2"
                                gutterBottom
                                sx={{ color: "grey.400" }}
                            >
                                {post.description}
                            </StyledTypography>

                            {post.updatedAt && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "grey.500" }}
                                    >
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
};

export default LatestPostsLayout;
