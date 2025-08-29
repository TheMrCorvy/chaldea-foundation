import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@/services/featureFlagService";
import { CookiesList } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";
import { ApiRoutes, WebRoutes } from "./utils/routes";

export const config = {
    matcher: "/",
};

export async function middleware(request: NextRequest) {
    const session = request.cookies.get(CookiesList.USER);
    const token = request.cookies.get(CookiesList.JWT);

    const ff = isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN);
    if (!ff && (!session || !token)) {
        return NextResponse.redirect(
            new URL(ApiRoutes.mockSession, request.url)
        );
    }

    if (!session || !token) {
        return NextResponse.redirect(new URL(WebRoutes.login, request.url));
    }

    return NextResponse.next();
}
