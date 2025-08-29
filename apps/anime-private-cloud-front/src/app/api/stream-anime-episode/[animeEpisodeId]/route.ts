import { NextRequest, NextResponse } from "next/server";
import { CookiesList, getCookie, JwtCookie } from "@/utils/cookies";
import { StrapiService } from "@/services/StrapiService";
import {
    CaseRagneNotSatisfiable,
    CaseRangeAvailableOnReqHeaders,
} from "@/types/NasSDK";
import logData from "@/utils/logData";
import { FeatureNames } from "@/services/featureFlagService";
import { NasService } from "@/services/NasService";

export async function GET(
    request: NextRequest,
    { params }: { params: { animeEpisodeId: string } }
) {
    logData({
        data: {
            animeEpisodeId: params.animeEpisodeId,
        },
        ff: FeatureNames.LOG_INTERNAL_HTTP_REQUESTS,
        title: "/stream-anime-episode/[animeEpisodeId]",
    });

    const jwt = getCookie(CookiesList.JWT) as JwtCookie | null;

    const service = StrapiService();
    const animeEpisode = await service.getSingleAnimeEpisode({
        jwt: jwt?.jwt || "",
        id: params.animeEpisodeId,
    });

    const nasService = NasService();

    const response = await nasService.serveEpisode({
        filePath: animeEpisode.data?.file_path as string,
        range: request.headers.get("range"),
    });

    if (response.status && response.status === 416) {
        const finalErrResponse = response as CaseRagneNotSatisfiable;

        return new NextResponse(finalErrResponse.message, {
            status: finalErrResponse.status,
        });
    }

    const finalSuccessResponse = response as CaseRangeAvailableOnReqHeaders;

    return new NextResponse(finalSuccessResponse.stream as any, {
        headers: finalSuccessResponse.headers,
        status: finalSuccessResponse.status,
    });
}
