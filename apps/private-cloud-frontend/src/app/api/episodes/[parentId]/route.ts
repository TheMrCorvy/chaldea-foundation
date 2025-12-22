import { CookiesList, getCookie, JwtCookie } from "@/utils/cookies";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { QueryParams } from "@repo/type-definitions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ parentId: string }> }
) => {
    const jwtCookie = (await getCookie(CookiesList.JWT)) as JwtCookie | null;

    if (!jwtCookie || !jwtCookie.jwt) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
        });
    }

    if (!params) {
        return new Response(JSON.stringify({ message: "Bad Request" }), {
            status: 400,
        });
    }

    const platformService = new PlatformService();
    platformService.setJWT(jwtCookie.jwt);

    const { parentId } = await params;

    logData({
        title: "Getting episodes by parent id",
        data: parentId,
        layer: "internal_http_requests",
        timeStamp: true,
        addSeparatorAfter: true,
        addSpaceAfter: true,
    });

    const queryParams: QueryParams = {
        fields: ["documentId", "display_name"],
        pagination: {
            pageSize: 500,
            page: 1,
        },
        filters: {
            parent_directory: {
                documentId: {
                    $eq: parentId,
                },
            },
        },
        sort: ["display_name:asc"],
    };

    const episodes = await platformService.call("bEpisodeGetBEpisodes", {
        query: queryParams,
    });

    logData({
        layer: "internal_http_requests",
        title: "Fetched episodes from Platform Service",
        type: "info",
        data: episodes,
        addSeparatorAfter: true,
        addSpaceAfter: true,
    });

    return NextResponse.json(episodes.data.data, { status: 200 });
};
