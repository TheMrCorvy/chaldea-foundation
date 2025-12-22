import {
    CookiesList,
    deleteCookie,
    getCookie,
    JwtCookie,
} from "@/utils/cookies";
import { logData } from "@repo/shared-utils/log-data";
import { NextResponse } from "next/server";

export async function POST() {
    const jwtCookie = (await getCookie(CookiesList.JWT)) as JwtCookie | null;

    await deleteCookie(CookiesList.JWT);
    await deleteCookie(CookiesList.USER);

    if (!jwtCookie) {
        return NextResponse.json({
            success: true,
            message: "No active session",
        });
    }

    logData({
        title: "Logged out successfully from Strapi!",
        layer: "auth_logout",
        type: "info",
        timeStamp: true,
        addSeparatorAfter: true,
        addSpaceAfter: true,
    });

    return NextResponse.json({ success: true });
}
