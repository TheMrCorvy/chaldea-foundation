import BottomNav from "@/components/BottomNavbar";
import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import { Page } from "@/utils/pageTypes";
import { WebRoutes } from "@/utils/routes";
import { Breadcrumbs, Card, Container, Grid, Link, Typography } from "@mui/joy";
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
    const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;
    const { id } = await params;

    if (
        !id ||
        !jwt ||
        !userCookie ||
        !jwt.jwt ||
        !userCookie.role ||
        (userCookie.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
            userCookie.role.type !== RoleTypes.ANIME_WATCHER)
    ) {
        return redirect(WebRoutes.NOT_FOUND + "/1");
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
        },
        fields: ["display_name", "documentId", "adult"],
        sort: ["display_name:asc"],
        pagination: {
            pageSize: 2000,
        },
    };

    if (
        userCookie.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
        subDirectoriesQuery.filters
    ) {
        subDirectoriesQuery.filters.adult = {
            $eq: false,
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
        return redirect(WebRoutes.NOT_FOUND + "/2");
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

    const mainDirectoriesResponse = await platformService.call(
        "bDirectoryGetBDirectories",
        {
            query: {
                filters: {
                    parent_directory: {
                        $null: true,
                    },
                },
                fields: ["display_name", "documentId", "adult"],
            },
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
                populate: ["parent_directory"],
                fields: ["display_name", "documentId", "adult"],
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
                    {subDirectories.length > 0 && (
                        <SubDirectoriesList
                            subDirectories={subDirectories}
                            hasEpisodes={episodes.length > 0}
                        />
                    )}
                    {episodes.length > 0 && (
                        <Grid
                            container
                            justifyContent={"space-around"}
                            component="section"
                        >
                            {episodes.map((episode, i) => (
                                <Grid
                                    key={`episodes-list-directory-page-${episode.documentId}-${i}`}
                                    xs={"auto"}
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                >
                                    <EpisodeCard
                                        episode={episode}
                                        userId={userCookie.documentId}
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
                    userCookie?.role.type === RoleTypes.ADULT_ANIME_WATCHER
                }
            />
        </>
    );
};

export default DirectoryPage;
