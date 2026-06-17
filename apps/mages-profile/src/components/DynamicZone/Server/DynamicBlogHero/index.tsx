import { FC } from "react";
import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RichTextRenderer from "../../../RichTextRenderer";
import DynamicLink from "../../Shared/DynamicLink";
import styles from "./DynamicBlogHero.module.css";
import useStyles from "./useStyles";
import { DynamicBlogHeroProps } from "../../Client/DynamicBlogHero";
import Image from "next/image";

const cornerIconSize = 24;

const DynamicBlogHero: FC<DynamicBlogHeroProps> = ({
    body,
    cover_image,
    title,
    links_to_pages,
    highlighted_text_color,
    imageBaseUrl,
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
                    <span>
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
                    </span>
                    {links_to_pages && links_to_pages.length > 0 && (
                        <Box
                            sx={{
                                mt: 2,
                                color: "#f3f3f3",
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            {links_to_pages.map((link, index) => (
                                <DynamicLink key={index} {...link} />
                            ))}
                        </Box>
                    )}
                </Box>
                <Box sx={hologramImage}>
                    {cover_image?.url ? (
                        <Image
                            src={imageBaseUrl + cover_image.url}
                            alt={cover_image.name || "Hero Banner"}
                            fill
                            style={{
                                objectFit: "cover",
                                opacity: 0.85,
                                mixBlendMode: "screen",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                padding: 5,
                            }}
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
