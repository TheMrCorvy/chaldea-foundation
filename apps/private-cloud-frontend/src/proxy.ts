import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import { ApiRoutes, WebRoutes } from "./utils/routes";
import { NextResponse, type NextRequest } from "next/server";
import { RoleTypes } from "@repo/type-definitions";
import { logData } from "@repo/shared-utils/log-data";

const protectedRoutes = [
    WebRoutes.HOME,
    WebRoutes.SEARCH,
    WebRoutes.DIRECTORY,
    WebRoutes.EPISODE,
    WebRoutes.PENDING_USER_ACTIVATION,
];

function checkIsProtectedRoute(path: WebRoutes) {
    return protectedRoutes.includes(path);
}

export async function proxy(request: NextRequest) {
    const currentPath = request.nextUrl.pathname as WebRoutes;
    const isProtectedRoute = checkIsProtectedRoute(currentPath);

    if (!isProtectedRoute) return NextResponse.next();

    try {
        const session = (await getCookie(
            CookiesList.USER
        )) as MeResponse | null;
        const token = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
        const ff = isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN);

        if (!ff && (!session || !token)) {
            return NextResponse.redirect(
                new URL(ApiRoutes.MOCK_SESSION, request.url)
            );
        }

        if (!session || !token) {
            return NextResponse.redirect(new URL(WebRoutes.LOGIN, request.url));
        }

        const hasValidRole =
            session.role &&
            (session.role.type === RoleTypes.ADULT_ANIME_WATCHER ||
                session.role.type === RoleTypes.ANIME_WATCHER ||
                session.role.type === RoleTypes.ANIME_PAGE_ADMIN);

        if (
            !hasValidRole &&
            currentPath !== WebRoutes.PENDING_USER_ACTIVATION
        ) {
            return NextResponse.redirect(
                new URL(WebRoutes.PENDING_USER_ACTIVATION, request.url)
            );
        }

        return NextResponse.next();
    } catch (error) {
        logData({
            title: "Error in proxy middleware",
            data: error,
            type: "error",
            layer: "auth_login",
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });
        return NextResponse.redirect(new URL(WebRoutes.LOGIN, request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
