import { BlogHero } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RichTextRenderer from "../../../RichTextRenderer";
import DynamicLink from "../DynamicLink";
import styles from "./DynamicBlogHero.module.css";
import useStyles from "./useStyles";

const cornerIconSize = 24;

const DynamicBlogHero: FC<BlogHero> = ({
    body,
    cover_image,
    title,
    link_to_page,
    highlighted_text_color,
}) => {
    const {
        root,
        textContainer,
        textContent,
        title: titleStyles,
        hologramImage,
        noImage,
        noData,
        divider,
    } = useStyles();

    return (
        <Box component="section" className={styles.heroContainer} sx={root}>
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    zIndex: 10,
                }}
            />
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(90deg)",
                    zIndex: 10,
                }}
            />
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(180deg)",
                    zIndex: 10,
                }}
            />
            <AddIcon
                color="warning"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(270deg)",
                    zIndex: 10,
                }}
            />

            <Box sx={textContainer}>
                <Box sx={textContent}>
                    {title && (
                        <Typography variant="h2" sx={titleStyles}>
                            {title}
                        </Typography>
                    )}
                    {body && (
                        <RichTextRenderer
                            content={body}
                            color="rgba(178, 221, 255, 0.95)"
                            highlighted_text_color={highlighted_text_color}
                        />
                    )}
                    {link_to_page && (
                        <Box sx={{ mt: 2 }}>
                            <DynamicLink {...link_to_page} />
                        </Box>
                    )}
                </Box>
                <Box sx={hologramImage}>
                    {cover_image?.url ? (
                        <Image
                            src={cover_image.url}
                            alt={cover_image.name || "Hero Banner"}
                            fill
                            style={{
                                objectFit: "cover",
                                opacity: 0.85,
                                mixBlendMode: "screen",
                            }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <Box sx={noImage}>
                            <Typography sx={noData}>
                                NO DATA STREAM DETECTED
                            </Typography>
                        </Box>
                    )}
                    <Box sx={divider} />
                </Box>
            </Box>
        </Box>
    );
};

export default DynamicBlogHero;
