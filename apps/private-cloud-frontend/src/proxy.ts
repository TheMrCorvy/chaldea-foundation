import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { CookiesList } from "@/utils/cookies";
import { ApiRoutes, WebRoutes } from "./utils/routes";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
    WebRoutes.HOME,
    WebRoutes.SEARCH,
    WebRoutes.DIRECTORY,
    WebRoutes.EPISODE,
];

function checkIsProtectedRoute(path: WebRoutes) {
    return protectedRoutes.includes(path);
}

export async function proxy(request: NextRequest) {
    const currentPath = request.nextUrl.pathname as WebRoutes;
    const isProtectedRoute = checkIsProtectedRoute(currentPath);

    if (!isProtectedRoute) return NextResponse.next();

    try {
        const session = request.cookies.get(CookiesList.USER);
        const token = request.cookies.get(CookiesList.JWT);
        const ff = isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN);

        if (!ff && (!session || !token)) {
            return NextResponse.redirect(
                new URL(ApiRoutes.MOCK_SESSION, request.url)
            );
        }

        if (!session || !token) {
            return NextResponse.redirect(new URL(WebRoutes.LOGIN, request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error verifying user authentication:", error);
        return NextResponse.redirect(new URL(WebRoutes.LOGIN, request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
