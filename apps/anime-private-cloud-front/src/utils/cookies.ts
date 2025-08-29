import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@/services/featureFlagService";

import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

import { MeResponse } from "@/types/StrapiSDK";

export enum CookiesList {
    USER = "user",
    JWT = "jwt",
}

export interface JwtCookie {
    jwt: string;
}

export interface UserCookie extends MeResponse {}

export type CookieFound = JwtCookie | UserCookie | null;

export const setCookie = (cookieName: CookiesList, cookieObject: object) => {
    const cookie = { cookieObject };

    cookies().set(cookieName, JSON.stringify(cookie), {
        httpOnly: true,
    });
};

export const getCookie = (cookieName: CookiesList): CookieFound => {
    const cookie = cookies().get(cookieName)?.value;
    if (!cookie) return null;

    return JSON.parse(cookie).cookieObject;
};

// export const updateCookie = async (
// 	cookieName: CookiesList,
// 	request: NextRequest
// ) => {
// 	"use server";

// 	const cookie = request.cookies.get(cookieName)?.value;
// 	if (!cookie) return;

// 	const parsed = JSON.parse(cookie);
// 	parsed.expires = new Date(Date.now() + 1000000 * 1000);

// 	const res = NextResponse.next();

// 	res.cookies.set({
// 		name: cookieName,
// 		value: JSON.stringify(parsed),
// 		httpOnly: true,
// 		expires: parsed.expires,
// 	});

// 	return res;
// };

export const removeCookie = (cookieName: CookiesList) => {
    if (isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN)) {
        cookies().delete(cookieName);
    }
};
