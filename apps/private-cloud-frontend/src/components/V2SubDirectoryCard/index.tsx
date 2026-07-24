import { FC, CSSProperties } from "react";
import {
    Box,
    Card,
    CardContent,
    CardOverflow,
    Chip,
    Grid,
    Tooltip,
    Typography,
} from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import { WebRoutes } from "@/utils/routes";
import Link from "next/link";
import useStyles from "./useStyles";
import ErrorIcon from "@mui/icons-material/Error";
import NoAdultContentIcon from "@mui/icons-material/NoAdultContent";

export interface V2SubDirectoryCardProps {
    directory: Directory;
    imageBaseUrl: string;
}

const V2SubDirectoryCard: FC<V2SubDirectoryCardProps> = ({
    directory,
    imageBaseUrl,
}) => {
    const {
        root,
        cardLink,
        cardStyles,
        cardCover,
        coverStyles,
        cardBodyStyles,
        titleStyles,
        cardBtnStyles,
        cardBtnLinkStyles,
        tagsContainer,
        tagStyles,
        descriptionStyles,
    } = useStyles({
        hasCover: directory.cover ? true : false,
    });

    const directoryLinkUrl = `${WebRoutes.DIRECTORY}/${directory.documentId}`;

    return (
        <Grid lg={12} xl={6} sx={root}>
            <Card orientation="horizontal" variant="soft" sx={cardStyles}>
                {directory.cover && (
                    <Link
                        href={directoryLinkUrl}
                        style={cardLink as CSSProperties}
                    >
                        <Box sx={cardCover}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageBaseUrl + directory.cover?.url}
                                alt={directory.display_name}
                                style={coverStyles as CSSProperties}
                                className="card-cover-image"
                            />
                        </Box>
                    </Link>
                )}
                <CardContent sx={cardBodyStyles}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <Link
                            href={directoryLinkUrl}
                            style={{
                                textDecoration: "none",
                                flexGrow: 1,
                                minWidth: 0,
                            }}
                        >
                            <Typography level="title-md" sx={titleStyles}>
                                {directory.display_name}
                            </Typography>
                        </Link>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                flexShrink: 0,
                            }}
                        >
                            {directory.age_rating === "explicit" && (
                                <Tooltip
                                    title="Contenido sensible"
                                    placement="top"
                                    variant="solid"
                                >
                                    <ErrorIcon
                                        data-testid="ErrorIcon"
                                        sx={{
                                            fontSize: 20,
                                            color: "orange",
                                        }}
                                    />
                                </Tooltip>
                            )}
                            {directory.age_rating === "adults" && (
                                <Tooltip
                                    title="Contenido para adultos"
                                    placement="top"
                                    variant="solid"
                                >
                                    <NoAdultContentIcon
                                        data-testid="NoAdultContentIcon"
                                        sx={{
                                            fontSize: 20,
                                            color: "#e63946",
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    </Box>

                    {directory.description && (
                        <Typography level="body-sm" sx={descriptionStyles}>
                            {directory.description}
                        </Typography>
                    )}

                    {directory.tags && directory.tags.length > 0 && (
                        <Box sx={tagsContainer}>
                            {directory.tags.map((tag, index) => {
                                return (
                                    <Chip
                                        key={`tag-${index}`}
                                        size="md"
                                        variant="soft"
                                        sx={tagStyles}
                                    >
                                        {tag.name}
                                    </Chip>
                                );
                            })}
                        </Box>
                    )}
                </CardContent>
                <CardOverflow sx={cardBtnStyles}>
                    <Link
                        href={directoryLinkUrl}
                        style={cardBtnLinkStyles as CSSProperties}
                    >
                        ENTRAR
                    </Link>
                </CardOverflow>
            </Card>
        </Grid>
    );
};

export default V2SubDirectoryCard;
