import { Box, Typography } from "@mui/material";
import { BlogImageComponent } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import Image from "next/image";
import useStyles from "./useStyles";

const DynamicBlogImage: FC<BlogImageComponent> = ({
    component_id,
    title,
    alt,
    width,
    height,
    body,
    image,
}) => {
    const {
        root,
        titleStyles,
        imageContainer,
        noVisualData,
        divider,
        bodyStyles,
    } = useStyles();
    return (
        <Box
            id={component_id}
            sx={{
                ...root,
                maxWidth: width ? `${width}px` : "1000px",
            }}
        >
            {title && (
                <Typography variant="h5" sx={titleStyles}>
                    {title}
                </Typography>
            )}

            <Box
                sx={{
                    aspectRatio:
                        width && height ? `${width} / ${height}` : "16 / 9",
                    ...imageContainer,
                }}
            >
                {image?.url ? (
                    <Image
                        src={image.url}
                        alt={
                            alt ||
                            image.alternativeText ||
                            title ||
                            "Hologram Image Data"
                        }
                        fill
                        style={{
                            objectFit: "cover",
                            opacity: 0.85,
                            mixBlendMode: "screen",
                        }}
                        sizes="(max-width: 1200px) 100vw, 80vw"
                    />
                ) : (
                    <Box sx={noVisualData}>
                        <Typography
                            sx={{
                                letterSpacing: "0.2em",
                                fontWeight: "bold",
                            }}
                        >
                            NO VISUAL DATA
                        </Typography>
                    </Box>
                )}
                <Box sx={divider} />
            </Box>

            {body && (
                <Typography
                    component="figcaption"
                    variant="body2"
                    sx={bodyStyles}
                >
                    {body}
                </Typography>
            )}
        </Box>
    );
};

export default DynamicBlogImage;
