import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    request: NextRequest,
    { params }: { params: Promise<{ parentId: string }> }
) => {
    const jwtCookie = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
    const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;

    if (!jwtCookie || !jwtCookie.jwt || !userCookie || !userCookie.documentId) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }

    const { parentId: id } = await params;
    if (!id) {
        return new Response(JSON.stringify({ message: "Bad Request" }), {
            status: 400,
        });
    }

    const platformService = new PlatformService();
    platformService.setJWT(jwtCookie.jwt);

    try {
        logData({
            title: `Marking episode ${id} as unseen for user ${userCookie.documentId}`,
            layer: "external_http_requests",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        const episodeResponse = await platformService.call(
            "bEpisodeGetBEpisodesById",
            {
                path: {
                    id,
                },
            }
        );

        const episode = episodeResponse.data.data;
        const currentWatchedBy = episode.watched_by?.data || [];

        const updatedWatchedBy = currentWatchedBy.filter(
            (userId: string) => userId !== userCookie.documentId
        );

        const updateResponse = await platformService.call(
            "bEpisodePutBEpisodesById",
            {
                path: {
                    id,
                },
                body: {
                    data: {
                        watched_by: {
                            data: updatedWatchedBy,
                        },
                    },
                },
            }
        );

        return NextResponse.json(updateResponse.data.data, { status: 200 });
    } catch (error) {
        logData({
            title: "Error updating episode unseen status",
            data: { error },
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            {
                status: 500,
            }
        );
    }
};
