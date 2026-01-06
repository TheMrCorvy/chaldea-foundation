import BottomNav from "@/components/BottomNavbar";
import SecureVideoPlayer from "@/components/SecureVideoPlayer";
import V2SecureVideoPlayer from "@/components/V2SecureVideoPlayer";
import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import { Page } from "@/utils/pageTypes";
import { WebRoutes } from "@/utils/routes";
import { getScreenSize } from "@/utils/screenSize";
import { Breadcrumbs, Card, Container, Link, Typography } from "@mui/joy";
import PlatformService from "@repo/platform-service-sdk";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { logData } from "@repo/shared-utils/log-data";
import { Directory, Episode, RoleTypes } from "@repo/type-definitions";
import { redirect } from "next/navigation";

const EpisodePage = async ({ params }: Page) => {
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
    let episode: Episode;

    const platformService = new PlatformService();
    platformService.setJWT(jwt.jwt);

    const [episodeBeforeWatching, mainDirectoriesResponse] = await Promise.all([
        platformService.call("bEpisodeGetBEpisodesById", {
            path: {
                id,
            },
            query: {
                populate: ["parent_directory"],
            },
        }),
        platformService.call("bDirectoryGetBDirectories", {
            query: {
                filters: {
                    parent_directory: {
                        $null: true,
                    },
                },
                fields: ["display_name", "documentId", "adult"],
            },
        }),
    ]);

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
        return redirect(WebRoutes.NOT_FOUND + "/2");
    }

    try {
        episode = episodeBeforeWatching.data.data;
    } catch (error) {
        logData({
            title: "Get episode query threw an error",
            data: { episodeBeforeWatching, error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return redirect(WebRoutes.NOT_FOUND + "/3");
    }

    if (!episode.watched_by?.data.includes(userCookie.documentId)) {
        const prevWatchedBy = episode.watched_by?.data.map((id) => id);
        const updatedEpisodeResponse = await platformService.call(
            "bEpisodePutBEpisodesById",
            {
                path: {
                    id,
                },
                body: {
                    data: {
                        watched_by: {
                            data: prevWatchedBy
                                ? [...prevWatchedBy, userCookie.documentId]
                                : [userCookie.documentId],
                        },
                    },
                },
            }
        );

        try {
            episode = {
                ...episode,
                watched_by: updatedEpisodeResponse.data.data.watched_by,
            };
        } catch (error) {
            logData({
                title: "Update episode query threw an error",
                data: { updatedEpisodeResponse, error },
                layer: "*",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });
            return redirect(WebRoutes.NOT_FOUND + "/4");
        }
    }

    const enableNas = isFeatureFlagEnabled(FeatureNames.CONSUME_NAS_FILES);

    return (
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
                {episode.parent_directory && (
                    <Link
                        color="neutral"
                        href={
                            WebRoutes.DIRECTORY +
                            "/" +
                            episode.parent_directory.documentId
                        }
                    >
                        {episode.parent_directory.display_name}
                    </Link>
                )}
                <Typography>{episode.display_name}</Typography>
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
                <Typography
                    level="h1"
                    component="h1"
                    fontSize={{
                        xs: "md",
                        sm: "lg",
                        md: "xl",
                        lg: "xl4",
                    }}
                    fontWeight="bold"
                    mt={0}
                    mb={1}
                    sx={{
                        textTransform: "capitalize",
                    }}
                >
                    {episode.display_name}
                </Typography>
                {episode.version === "V1" ||
                episode.file_type === "mp4" ||
                episode.file_type === "MP4" ? (
                    <SecureVideoPlayer
                        display_name={episode.display_name}
                        path={episode.parent_directory?.path || ""}
                        fileType={episode.file_type}
                        documentId={episode.documentId}
                        parent={episode.parent_directory?.documentId || ""}
                        useMockVideo={!enableNas}
                        apiKey={enableNas ? process.env.NAS_API_KEY || "" : ""}
                        nasBaseUrl={process.env.NAS_BASE_URL || ""}
                        enableProxy={isFeatureFlagEnabled(
                            FeatureNames.ENABLE_STREAMING_PROXY
                        )}
                    />
                ) : (
                    <V2SecureVideoPlayer
                        display_name={episode.display_name}
                        path={episode.parent_directory?.path || ""}
                        fileType={episode.file_type}
                        documentId={episode.documentId}
                        languages_info={episode.languages_info}
                        parent={episode.parent_directory?.documentId || ""}
                        apiKey={enableNas ? process.env.NAS_API_KEY || "" : ""}
                        nasBaseUrl={process.env.NAS_BASE_URL || ""}
                    />
                )}
            </Card>
            <BottomNav
                mainDirectories={mainDirectories}
                allowAdultContent={
                    userCookie?.role.type === RoleTypes.ADULT_ANIME_WATCHER
                }
            />
        </Container>
    );
};

export default EpisodePage;
