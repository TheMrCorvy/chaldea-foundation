import { mockMeResponse, mockUserToken } from "@/mocks/mockedResponses";
import { FeatureFlagsAvailable } from "@repo/config/feature-flags";
import { isFeatureFlagEnabled } from "@repo/shared-utils/feature-flags";
import { CookiesList, setCookie } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const redirectUrl = `${protocol}://${host}/`;

    const response = NextResponse.redirect(redirectUrl);

    if (isFeatureFlagEnabled(FeatureFlagsAvailable.ENABLE_USERS_LOGIN)) {
        return response;
    }

    await setCookie({
        name: CookiesList.USER,
        value: mockMeResponse,
    });

    await setCookie({
        name: CookiesList.JWT,
        value: mockUserToken,
    });

    return response;
}
