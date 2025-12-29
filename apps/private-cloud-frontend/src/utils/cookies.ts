import { cookies } from "next/headers";
import { type RoleTypes } from "@repo/type-definitions";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";

export interface MeResponse {
    createdAt: Date;
    updatedAt: Date;
    email: string;
    username: string;
    id: number;
    documentId: string;
    provider: string;
    blocked: boolean;
    confirmed: boolean;
    role: Role;
    ok: boolean;
}

export interface Role {
    createdAt: Date;
    id: number;
    name: string;
    updatedAt: Date;
    type: RoleTypes | string;
    description: string;
}

export enum CookiesList {
    USER = "user",
    JWT = "jwt",
}

export interface JwtCookie {
    jwt: string;
}

export type CookieFound = JwtCookie | MeResponse | null;

export type GetCookie = (cookieName: CookiesList) => Promise<CookieFound>;

export const getCookie: GetCookie = async (cookieName) => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName)?.value;
    if (!cookie) return null;

    return JSON.parse(cookie).cookieObject;
};

export interface SetCookieParams {
    name: string;
    value: string | MeResponse;
}

export type SetCookie = (params: SetCookieParams) => Promise<void>;

export const setCookie: SetCookie = async (params) => {
    const cookieStore = await cookies();

    const value =
        typeof params.value === "string" ? { jwt: params.value } : params.value;

    cookieStore.set({
        name: params.name,
        value: JSON.stringify({ cookieObject: value }),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
};

export const deleteCookie = async (cookieName: CookiesList) => {
    const cookieStore = await cookies();

    if (
        cookieStore.get(cookieName) &&
        isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN)
    ) {
        cookieStore.delete(cookieName);
    }
};
