import BottomNav from "@/components/BottomNavbar";
import MainCategories from "@/components/MainCategories";
import RecentAdditions from "@/components/RecentAdditions";
import {
    CookiesList,
    deleteCookie,
    getCookie,
    JwtCookie,
    MeResponse,
} from "@/utils/cookies";
import { WebRoutes } from "@/utils/routes";
import { Box, Container } from "@mui/joy";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import {
    Directory,
    Episode,
    QueryParams,
    RoleTypes,
} from "@repo/type-definitions";
import { redirect } from "next/navigation";

const Home = async () => {
    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie;
    const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;

    if (
        !jwt ||
        !userCookie ||
        !jwt.jwt ||
        !userCookie.role ||
        (userCookie.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
            userCookie.role.type !== RoleTypes.ANIME_WATCHER &&
            userCookie.role.type !== RoleTypes.EXPLICIT_ANIME_WATCHER)
    ) {
        await deleteCookie(CookiesList.JWT);
        await deleteCookie(CookiesList.USER);
        return redirect(WebRoutes.LOGIN);
    }

    const platformService = new PlatformService();
    platformService.setJWT(jwt.jwt);

    const queryObject: QueryParams = {
        filters: {
            parent_directory: {
                documentId: {
                    $null: true,
                },
            },
        },
        pagination: {
            pageSize: 5,
        },
    };

    if (
        userCookie.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
        queryObject.filters
    ) {
        queryObject.filters.age_rating = {
            $eq: "everyone",
        };
    }

    const response = await platformService.call("bDirectoryGetBDirectories", {
        query: queryObject,
    });

    logData({
        title: "Fetched Main Directories",
        data: response.data,
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
        layer: "external_http_requests",
        type: "info",
    });

    const mainDirectories = response.data.data as Directory[];

    const recentDirectoriesResponse = await platformService.call(
        "bDirectoryGetBDirectories",
        {
            query: {
                sort: ["createdAt:desc"],
                pagination: {
                    pageSize: 10,
                },
                filters: {
                    age_rating: {
                        $eq: "everyone",
                    },
                },
            },
        }
    );

    logData({
        title: "Fetched Recent Directories",
        data: recentDirectoriesResponse.data,
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
        layer: "external_http_requests",
        type: "info",
    });

    const recentDirectories = (recentDirectoriesResponse.data.data ||
        []) as Directory[];

    const recentEpisodesResponse = await platformService.call(
        "bEpisodeGetBEpisodes",
        {
            query: {
                sort: ["createdAt:desc"],
                pagination: {
                    pageSize: 10,
                },
                filters: {
                    parent_directory: {
                        age_rating: {
                            $eq: "everyone",
                        },
                    },
                },
            },
        }
    );

    logData({
        title: "Fetched Recent Episodes",
        data: recentEpisodesResponse.data,
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
        layer: "external_http_requests",
        type: "info",
    });

    const recentEpisodes = (recentEpisodesResponse.data.data ||
        []) as Episode[];

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        flexGrow: 1,
                        py: 4,
                    }}
                >
                    <MainCategories directories={mainDirectories} />
                </Container>
                <RecentAdditions
                    recentDirectories={recentDirectories}
                    recentEpisodes={recentEpisodes}
                />
            </Box>
            <BottomNav
                mainDirectories={mainDirectories}
                allowAdultContent={
                    userCookie?.role.type === RoleTypes.ADULT_ANIME_WATCHER
                }
                allowExplicitContent={
                    userCookie?.role.type === RoleTypes.EXPLICIT_ANIME_WATCHER
                }
            />
        </>
    );
};

export default Home;
