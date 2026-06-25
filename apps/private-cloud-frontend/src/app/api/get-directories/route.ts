import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { QueryParams, RoleTypes } from "@repo/type-definitions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const {
        query,
        allowAdultContent,
        onlySearchAdultContent,
        page,
        pageSize,
        allowExplicitContent,
        onlySearchExplicitContent,
    } = body;

    const jwtCookie = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
    const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;

    if (
        !jwtCookie ||
        !userCookie ||
        !userCookie.role ||
        (userCookie.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
            (onlySearchAdultContent || allowAdultContent))
    ) {
        logData({
            title: "Unidentified user tried to access backend resources",
            layer: "*",
            timeStamp: true,
            type: "error",
            data: {
                query,
                allowAdultContent,
                onlySearchAdultContent,
            },
            addSeparatorAfter: true,
            addSpaceAfter: true,
            addSeparatorBefore: true,
            addSpaceBefore: true,
        });

        return NextResponse.json(
            {
                message: "Búsqueda no autorizada",
                submitState: "error",
                data: {
                    query: String(query),
                    allowAdultContent,
                    onlySearchAdultContent,
                },
            },
            { status: 401 }
        );
    }

    const platformService = new PlatformService();
    platformService.setJWT(jwtCookie.jwt);

    const queryObject: QueryParams = {
        filters: {
            display_name: {
                $contains: String(query),
            },
            parent_directory: {
                $notNull: true,
            },
        },
        fields: ["documentId", "display_name", "age_rating"],
        pagination: {
            pageSize: pageSize ?? 100,
            page,
        },
        sort: ["display_name:asc"],
    };

    console.clear();
    console.log({
        onlySearchAdultContent,
        onlySearchExplicitContent,
        allowAdultContent,
        allowExplicitContent,
    });

    if (onlySearchAdultContent && queryObject.filters) {
        queryObject.filters.age_rating = {
            $eq: "adults",
        };
    } else if (onlySearchExplicitContent && queryObject.filters) {
        queryObject.filters.age_rating = {
            $eq: "explicit",
        };
    } else if (allowAdultContent && queryObject.filters) {
        queryObject.filters.age_rating = {
            $in: ["everyone", "adults", "explicit"],
        };
    } else if (allowExplicitContent && queryObject.filters) {
        queryObject.filters.age_rating = {
            $in: ["everyone", "explicit"],
        };
    } else if (queryObject.filters) {
        queryObject.filters.age_rating = {
            $eq: "everyone",
        };
    }

    const response = await platformService.call("bDirectoryGetBDirectories", {
        query: queryObject,
    });

    if (response.error) {
        logData({
            title: "Error searching episodes",
            layer: "external_http_requests",
            data: response.error,
            type: "error",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return NextResponse.json(
            {
                message: "Error realizando la búsqueda",
                submitState: "error",
                data: {
                    query: String(query),
                    allowAdultContent,
                    onlySearchAdultContent,
                },
            },
            { status: 500 }
        );
    }

    return NextResponse.json({
        message: "Búsqueda realizada con éxito",
        submitState: "success",
        data: {
            query: String(query),
            allowAdultContent,
            onlySearchAdultContent,
        },
        result: response.data,
    });
};
