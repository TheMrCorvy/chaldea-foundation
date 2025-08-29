import { mockMeResponse, mockUserToken } from "@/mocks/mockedResponses";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@/services/featureFlagService";
import { CookiesList, setCookie } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const redirectUrl = `${protocol}://${host}/`;

    const response = NextResponse.redirect(redirectUrl);

    if (isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN)) {
        return response;
    }

    setCookie(CookiesList.USER, mockMeResponse);
    setCookie(CookiesList.JWT, { jwt: mockUserToken });

    return response;
}
