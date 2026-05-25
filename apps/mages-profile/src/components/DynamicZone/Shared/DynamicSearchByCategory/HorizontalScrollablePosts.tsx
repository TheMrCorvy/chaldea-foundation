import { FC, RefObject } from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { BlogPost } from "@repo/type-definitions/dynamic-page";
import useStyles from "./useStyles";
import IconComponent from "../../../IconComponent";
import HologramGlitchText from "../../../HologramGlitchText";

interface HorizontalScrollablePostsProps {
    isOpen: boolean;
    posts: BlogPost[];
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    onCloseAnimationComplete: () => void;
}

const HorizontalScrollablePosts: FC<HorizontalScrollablePostsProps> = ({
    isOpen,
    posts,
    scrollContainerRef,
    onCloseAnimationComplete,
}) => {
    const { resultsContainer, resultCard, placeholderImage } = useStyles();

    const handleAnimationComplete = (definition: unknown) => {
        if (definition === "closed") {
            onCloseAnimationComplete();
        }
    };

    let content = null;

    if (posts.length > 0) {
        content = (
            <Box sx={resultsContainer} ref={scrollContainerRef}>
                {posts.map((post) => {
                    let mediaContent = (
                        <Box sx={placeholderImage}>
                            <IconComponent name="Search" />
                        </Box>
                    );

                    if (
                        post.cover_image &&
                        typeof post.cover_image === "object" &&
                        "url" in (post.cover_image as Record<string, unknown>)
                    ) {
                        mediaContent = (
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
                        );
                    }

                    return (
                        <motion.div
                            key={post.documentId || post.slug}
                            variants={{
                                open: { opacity: 1, y: 0 },
                                closed: { opacity: 0, y: 20 },
                            }}
                        >
                            <Card sx={resultCard}>
                                {mediaContent}
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
                    );
                })}
            </Box>
        );
    } else {
        content = <HologramGlitchText>No results found...</HologramGlitchText>;
    }

    return (
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
            animate={isOpen ? "open" : "closed"}
            onAnimationComplete={handleAnimationComplete}
            style={{
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#eeeeee",
                paddingTop: 12,
            }}
        >
            {content}
        </motion.div>
    );
};

export default HorizontalScrollablePosts;
