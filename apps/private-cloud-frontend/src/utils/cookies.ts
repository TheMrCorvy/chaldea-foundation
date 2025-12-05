import { cookies } from "next/headers";
import { type RoleTypes } from "@repo/type-definitions";

export interface MeResponse {
    createdAt: Date;
    updatedAt: Date;
    email: string;
    username: string;
    id: number;
    provider: string;
    blocked: boolean;
    confirmed: boolean;
    role: Role;
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

export const getCookie = async (
    cookieName: CookiesList
): Promise<CookieFound> => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName)?.value;
    if (!cookie) return null;

    return JSON.parse(cookie).cookieObject;
};
