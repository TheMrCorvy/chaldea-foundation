import BottomNav from "@/components/BottomNavbar";
import {
    CookiesList,
    deleteCookie,
    getCookie,
    JwtCookie,
    MeResponse,
} from "@/utils/cookies";
import { Page } from "@/utils/pageTypes";
import { WebRoutes } from "@/utils/routes";
import {
    Box,
    Breadcrumbs,
    Card,
    Chip,
    Container,
    Divider,
    Grid,
    Link,
    Typography,
} from "@mui/joy";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import {
    Directory,
    Episode,
    QueryParams,
    RoleTypes,
} from "@repo/type-definitions";
import { redirect } from "next/navigation";
import { getScreenSize } from "@/utils/screenSize";
import EpisodeCard from "@/components/EpisodeCard";
import SubDirectoriesList from "@/components/SubDirectoriesList";

const DirectoryPage = async ({ params }: Page) => {
    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie;
    // const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;
    const session = (await getCookie(CookiesList.USER)) as MeResponse | null;
    const { id } = await params;

    if (
        !id ||
        !jwt ||
        !session ||
        !jwt.jwt ||
        !session.role ||
        (session.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
            session.role.type !== RoleTypes.ANIME_WATCHER &&
            session.role.type !== RoleTypes.EXPLICIT_ANIME_WATCHER)
    ) {
        await deleteCookie(CookiesList.JWT);
        await deleteCookie(CookiesList.USER);
        return redirect(WebRoutes.LOGIN);
    }

    let mainDirectories: Directory[];
    let subDirectories: Directory[];
    let currentDirectory: Directory;
    let episodes: Episode[];

    const platformService = new PlatformService();
    platformService.setJWT(jwt.jwt);

    const subDirectoriesQuery: QueryParams = {
        filters: {
            parent_directory: {
                documentId: id,
            },
            is_processing: {
                $eq: false,
            },
        },
        populate: {
            cover: {
                populate: "*",
            },
            tags: {
                populate: "*",
            },
        },
        sort: ["display_name:asc"],
        pagination: {
            pageSize: 2000,
        },
    };

    if (
        session.role.type === RoleTypes.ANIME_WATCHER &&
        subDirectoriesQuery.filters
    ) {
        subDirectoriesQuery.filters.age_rating = {
            $eq: "everyone",
        };
    }

    if (
        session.role.type === RoleTypes.EXPLICIT_ANIME_WATCHER &&
        subDirectoriesQuery.filters
    ) {
        subDirectoriesQuery.filters.age_rating = {
            $in: ["everyone", "explicit"],
        };
    }

    if (
        session.role.type === RoleTypes.ADULT_ANIME_WATCHER &&
        subDirectoriesQuery.filters
    ) {
        subDirectoriesQuery.filters.age_rating = {
            $in: ["everyone", "explicit", "adults"],
        };
    }

    const directoriesResponse = await platformService.call(
        "bDirectoryGetBDirectories",
        {
            query: subDirectoriesQuery,
        }
    );

    try {
        subDirectories = directoriesResponse.data.data;
    } catch (error) {
        logData({
            title: "Sub directories query threw an error",
            data: { directoriesResponse, error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return null;
    }

    const episodesResponse = await platformService.call(
        "bEpisodeGetBEpisodes",
        {
            query: {
                populate: ["parent_directory"],
                filters: {
                    parent_directory: {
                        documentId: id,
                    },
                    is_processing: {
                        $eq: false,
                    },
                },
                sort: ["display_name:asc"],
                pagination: {
                    pageSize: 2000,
                },
            },
        }
    );

    try {
        episodes = episodesResponse.data.data;
    } catch (error) {
        logData({
            title: "Episodes query threw an error",
            data: { episodesResponse, error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return redirect(WebRoutes.NOT_FOUND + "/3");
    }

    const queryObject: QueryParams = {
        filters: {
            parent_directory: {
                $null: true,
            },
        },
        fields: ["display_name", "documentId", "age_rating"],
    };

    if (
        session.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
        queryObject.filters
    ) {
        queryObject.filters.age_rating = {
            $in: ["everyone", "explicit"],
        };
    }

    const mainDirectoriesResponse = await platformService.call(
        "bDirectoryGetBDirectories",
        {
            query: queryObject,
        }
    );

    try {
        mainDirectories = mainDirectoriesResponse.data.data;
    } catch (error) {
        logData({
            title: "Main directories query threw an error",
            data: { mainDirectoriesResponse, error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return redirect(WebRoutes.NOT_FOUND + "/4");
    }

    const currentDirectoryResponse = await platformService.call(
        "bDirectoryGetBDirectoriesById",
        {
            path: {
                id,
            },
            query: {
                populate: {
                    parent_directory: {
                        populate: "*",
                    },
                    cover: {
                        populate: "*",
                    },
                    tags: {
                        populate: "*",
                    },
                },
                fields: [
                    "display_name",
                    "documentId",
                    "age_rating",
                    "description",
                ],
            },
        }
    );

    try {
        currentDirectory = currentDirectoryResponse.data.data;
    } catch (error) {
        logData({
            title: "Current directory query threw an error",
            data: { currentDirectoryResponse, error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return redirect(WebRoutes.NOT_FOUND + "/5");
    }

    if (currentDirectory.parent_directory) {
        subDirectories = [...subDirectories].sort((a, b) => {
            return a.display_name.localeCompare(b.display_name, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        });
        episodes = [...episodes].sort((a, b) => {
            return a.display_name.localeCompare(b.display_name, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        });
    }

    const imageBaseUrl = process.env.STRAPI_IMAGES_BASE_URL || "";

    if (!imageBaseUrl) {
        logData({
            title: "Image base URL is not defined",
            data: { imageBaseUrl },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return redirect(WebRoutes.NOT_FOUND + "/6");
    }

    const getCoverUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return `${imageBaseUrl}${url}`;
    };

    return (
        <>
            <Container
                maxWidth="xl"
                sx={{
                    textAlign: "left",
                    alignItems: "start",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    paddingTop: {
                        xs: 2,
                        md: 6,
                    },
                    paddingBottom: {
                        xs: 10,
                        md: 12,
                    },
                }}
            >
                <Breadcrumbs
                    aria-label="breadcrumbs"
                    sx={{
                        color: "white",
                        paddingLeft: 0,
                    }}
                >
                    <Link color="neutral" href={WebRoutes.HOME}>
                        Inicio
                    </Link>
                    {currentDirectory.parent_directory && (
                        <Link
                            color="neutral"
                            href={
                                WebRoutes.DIRECTORY +
                                "/" +
                                currentDirectory.parent_directory.documentId
                            }
                        >
                            {currentDirectory.parent_directory.display_name}
                        </Link>
                    )}
                    <Typography>{currentDirectory.display_name}</Typography>
                </Breadcrumbs>
                <Card
                    variant="outlined"
                    sx={{
                        minHeight: "81vh",
                        width: "100%",
                        marginBottom: 4,
                        [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                            minHeight: "80vh",
                        },
                    }}
                    component={"article"}
                >
                    {/* Directory Info Header */}
                    {currentDirectory.cover ||
                    currentDirectory.description ||
                    (currentDirectory.tags &&
                        currentDirectory.tags.length > 0) ? (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    gap: { xs: 3, md: 4 },
                                    mb: 3,
                                    mt: 1,
                                    alignItems: {
                                        xs: "center",
                                        sm: "flex-start",
                                    },
                                    width: "100%",
                                }}
                            >
                                {currentDirectory.cover && (
                                    <Box
                                        sx={{
                                            width: {
                                                xs: "100%",
                                                sm: 160,
                                                md: 200,
                                            },
                                            height: {
                                                xs: "auto",
                                                sm: 240,
                                                md: 300,
                                            },
                                            position: "relative",
                                            flexShrink: 0,
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            border: "1px solid rgba(11, 107, 203, 0.3)",
                                            boxShadow:
                                                "0 8px 32px rgba(0, 0, 0, 0.4)",
                                            transition: "transform 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                            },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={getCoverUrl(
                                                currentDirectory.cover.url
                                            )}
                                            alt={currentDirectory.display_name}
                                            sx={{
                                                width: "100%",
                                                height: {
                                                    xs: "auto",
                                                    sm: "100%",
                                                },
                                                objectFit: {
                                                    xs: "contain",
                                                    sm: "cover",
                                                },
                                                display: "block",
                                            }}
                                        />
                                    </Box>
                                )}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        flexGrow: 1,
                                        width: "100%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography
                                            level="h2"
                                            sx={{
                                                color: "white",
                                                fontWeight: 700,
                                                fontSize: {
                                                    xs: "1.8rem",
                                                    md: "2.2rem",
                                                },
                                            }}
                                        >
                                            {currentDirectory.display_name}
                                        </Typography>

                                        {currentDirectory.tags &&
                                            currentDirectory.tags.length >
                                                0 && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 1,
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {currentDirectory.tags.map(
                                                        (tag, idx) => (
                                                            <Chip
                                                                key={`current-dir-tag-${tag.documentId || idx}`}
                                                                size="md"
                                                                variant="soft"
                                                                sx={{
                                                                    textTransform:
                                                                        "capitalize",
                                                                    backgroundColor:
                                                                        "rgba(11, 107, 203, 0.2)",
                                                                    color: "#D2DBE8",
                                                                    fontWeight: 500,
                                                                    borderRadius:
                                                                        "6px",
                                                                }}
                                                            >
                                                                {tag.name}
                                                            </Chip>
                                                        )
                                                    )}
                                                </Box>
                                            )}
                                    </Box>

                                    {currentDirectory.description && (
                                        <Typography
                                            level="body-md"
                                            sx={{
                                                color: "#A8B2C3",
                                                lineHeight: 1.6,
                                                maxWidth: "800px",
                                            }}
                                        >
                                            {currentDirectory.description}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Divider
                                sx={{
                                    mb: 4,
                                    opacity: 0.3,
                                    backgroundColor: "rgba(11, 107, 203, 0.3)",
                                }}
                            />
                        </>
                    ) : (
                        <Typography
                            level="h2"
                            sx={{
                                color: "white",
                                fontWeight: 700,
                                mb: 3,
                                fontSize: { xs: "1.8rem", md: "2.2rem" },
                            }}
                        >
                            {currentDirectory.display_name}
                        </Typography>
                    )}
                    {subDirectories.length > 0 && (
                        <SubDirectoriesList
                            subDirectories={subDirectories}
                            hasEpisodes={episodes.length > 0}
                            imageBaseUrl={imageBaseUrl}
                        />
                    )}
                    {episodes.length > 0 && (
                        <Grid
                            container
                            justifyContent={"flex-start"}
                            component="section"
                            gap={2}
                        >
                            {episodes.map((episode, i) => (
                                <Grid
                                    key={`episodes-list-directory-page-${episode.documentId}-${i}`}
                                    xs={12}
                                    sm={"auto"}
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                >
                                    <EpisodeCard
                                        episode={episode}
                                        userId={session.documentId}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Card>
            </Container>
            <BottomNav
                mainDirectories={mainDirectories}
                allowAdultContent={
                    session?.role.type === RoleTypes.ADULT_ANIME_WATCHER
                }
            />
        </>
    );
};

export default DirectoryPage;
