import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import organizedDirectories from "@/utils/directories";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { QueryParams, RoleTypes } from "@repo/type-definitions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const jwtCookie = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
    const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;

    if (!jwtCookie || !jwtCookie.jwt || !userCookie || !userCookie.role?.type) {
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

    const { id } = await params;

    const queryParams: QueryParams = {
        fields: ["documentId", "display_name", "adult"],
        pagination: {
            pageSize: 500,
            page: 1,
        },
        sort: ["display_name:asc"],
    };

    if (userCookie.role.type === RoleTypes.ADULT_ANIME_WATCHER) {
        queryParams.filters = {
            parent_directory: {
                documentId: {
                    $eq: id,
                },
            },
        };
    } else {
        queryParams.filters = {
            adult: {
                $eq: false,
            },
            parent_directory: {
                documentId: {
                    $eq: id,
                },
            },
        };
    }

    const directories = await platformService.call(
        "bDirectoryGetBDirectories",
        {
            query: queryParams,
        }
    );

    const groupedDirectories = organizedDirectories(directories.data.data);

    logData({
        layer: "external_http_requests",
        title: "Fetched directories from Platform Service",
        type: "info",
        data: directories,
        addSeparatorAfter: true,
        addSpaceAfter: true,
    });

    return NextResponse.json(groupedDirectories, { status: 200 });
};
