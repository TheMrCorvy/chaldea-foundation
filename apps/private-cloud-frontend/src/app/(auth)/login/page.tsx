import type { Metadata } from "next";

import TicketForm from "@/components/TicketLoginComponent";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { notFound, redirect } from "next/navigation";
import { CookiesList, getCookie } from "@/utils/cookies";

export const metadata: Metadata = {
    title: "Login - Servicio de Streaming Privado",
    description: "Ingresar a la app de streaming privada.",
    openGraph: {
        title: "Login - Servicio de Streaming Privado",
        description: "Ingresar a la app de streaming privada.",
        images: [
            {
                url: "/kiyohime.webp",
                width: 1200,
                height: 630,
                alt: "Kiyohime from Fate/Grand Order",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Login - Servicio de Streaming Privado",
        description: "Ingresar a la app de streaming privada.",
        images: ["/kiyohime.webp"],
    },
};

export default async function Login() {
    if (!isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_LOGIN)) {
        notFound();
    }

    const userCookie = await getCookie(CookiesList.USER);
    const jwtCookie = await getCookie(CookiesList.JWT);

    if (userCookie && jwtCookie) {
        redirect("/");
    }

    return (
        <TicketForm
            isRegisterForm={false}
            ticketCode="X - X - X - X - X"
            ticketNumber="X-X-X-X-X"
            userName="Invitación exclusiva"
            createdAt={new Date()}
        />
    );
}
