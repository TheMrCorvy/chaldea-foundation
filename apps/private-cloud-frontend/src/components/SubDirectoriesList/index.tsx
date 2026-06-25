"use client";

import { FC } from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Link,
    Tooltip,
    Typography,
} from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import { WebRoutes } from "@/utils/routes";
import { getScreenSize } from "@/utils/screenSize";
import FolderIcon from "@mui/icons-material/Folder";
import ErrorIcon from "@mui/icons-material/Error";
import NoAdultContentIcon from "@mui/icons-material/NoAdultContent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface SubDirectoriesListProps {
    subDirectories: Directory[];
    hasEpisodes: boolean;
}

const SubDirectoriesList: FC<SubDirectoriesListProps> = ({
    subDirectories,
    hasEpisodes,
}) => {
    if (subDirectories.length === 0) {
        return null;
    }

    return (
        <Grid
            container
            spacing={2}
            component="section"
            sx={{
                marginBottom: hasEpisodes ? 3 : 0,
                display: "flex",
                justifyContent: "start",
                [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                    justifyContent: "center",
                },
            }}
        >
            {subDirectories.map((subDir, i) => (
                <Grid
                    key={`directory-page-sub-directories-list-${subDir.documentId}-${i}`}
                    xs="auto"
                >
                    <Link
                        href={WebRoutes.DIRECTORY + "/" + subDir.documentId}
                        sx={{
                            textDecoration: "none",
                            zIndex: 0,
                            "&:hover": {
                                textDecoration: "none",
                            },
                        }}
                    >
                        <Card
                            variant="soft"
                            sx={{
                                backgroundColor: "#0B6BCB15 !important",
                                border: "1px solid #0B6BCB40",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    cursor: "pointer",
                                    transform: "translateX(4px)",
                                    backgroundColor: "#0B6BCB25 !important",
                                    borderColor: "#0B6BCB80",
                                },
                                [`@media (max-width: ${getScreenSize("xl")}px)`]:
                                    {
                                        width: "350px",
                                        textOverflow: "ellipsis",
                                    },
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 1.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        flex: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <FolderIcon
                                        sx={{
                                            fontSize: 28,
                                            color: "#0B6BCB",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            color: "white",
                                            fontWeight: 500,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {subDir.display_name}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        flexShrink: 0,
                                    }}
                                >
                                    {subDir.age_rating === "explicit" && (
                                        <Tooltip
                                            title="Contenido sensible"
                                            placement="top"
                                            variant="solid"
                                        >
                                            <ErrorIcon
                                                sx={{
                                                    fontSize: 20,
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                    {subDir.age_rating === "adults" && (
                                        <Tooltip
                                            title="Contenido para adultos"
                                            placement="top"
                                            variant="solid"
                                        >
                                            <NoAdultContentIcon
                                                sx={{
                                                    fontSize: 20,
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                    <ChevronRightIcon
                                        sx={{
                                            fontSize: 24,
                                            color: "#A8B2C3",
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
};

export default SubDirectoriesList;
