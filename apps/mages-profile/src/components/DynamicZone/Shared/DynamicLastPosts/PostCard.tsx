"use client";

import { BlogPost } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import PixelCard from "@/components/PixelCard";
import DynamicLink from "../DynamicLink";

const PLACEHOLDER_TEXT = "CHALDEA ARCHIVE FEED";

const PostCard: FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
    let imageUrl = "";
    let imageAlt = `${post.title} cover image`;

    if (post.cover_image?.url) {
        imageUrl = post.cover_image.url;
    }

    if (post.cover_image?.alt) {
        imageAlt = post.cover_image.alt;
    }

    return (
        <Card
            component={motion.article}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={{ y: -6, scale: 1.01 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: "easeOut",
            }}
            sx={{
                width: { xs: "90vw", md: "400px" },
                maxWidth: { xs: "90vw", md: "90%" },
                borderRadius: "12px",
                background:
                    "linear-gradient(150deg, rgba(9, 28, 52, 0.72), rgba(16, 40, 68, 0.58))",
                boxShadow: "0 12px 30px rgba(7, 20, 37, 0.58)",
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
            }}
        >
            {imageUrl && (
                <CardMedia
                    component="img"
                    height="300"
                    image={imageUrl}
                    alt={imageAlt}
                    sx={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        objectFit: "cover",
                        opacity: 0.88,
                    }}
                />
            )}
            {!imageUrl && (
                <Box
                    sx={{
                        height: 300,
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "radial-gradient(circle at 20% 30%, rgba(66, 165, 245, 0.22), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255, 160, 0, 0.2), transparent 58%), linear-gradient(160deg, rgba(12, 27, 44, 0.94), rgba(13, 40, 64, 0.7))",
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: "rgba(226, 241, 255, 0.86)",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                        }}
                    >
                        {PLACEHOLDER_TEXT}
                    </Typography>
                </Box>
            )}
            <PixelCard
                variant="blue"
                width="100%"
                roundedBorders={true}
                borders={{
                    top: false,
                    bottom: false,
                    left: false,
                    right: false,
                }}
            >
                <>
                    <CardHeader
                        title={post.title}
                        titleTypographyProps={{
                            variant: "h6",
                            sx: {
                                color: "rgba(236, 244, 255, 0.95)",
                                fontWeight: 700,
                                lineHeight: 1.3,
                            },
                        }}
                        sx={{ pb: 0.5 }}
                    />
                    <CardContent sx={{ pt: 1, flexGrow: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(200, 219, 236, 0.9)",
                                lineHeight: 1.7,
                            }}
                        >
                            {post.description ||
                                "Data fragment available. Open this archive to continue the briefing."}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0, color: "#eeeeee" }}>
                        <DynamicLink
                            href={`/${post.slug}`}
                            label="Open report"
                            variant="link_with_icon"
                            __component=""
                            title="Open report"
                            component_id=""
                            id={0}
                            color="inherit"
                            size="body2"
                        />
                    </CardActions>
                </>
            </PixelCard>
        </Card>
    );
};

export default PostCard;
