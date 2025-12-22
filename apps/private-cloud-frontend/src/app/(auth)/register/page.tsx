import type { Metadata } from "next";

import TicketForm from "@/components/TicketLoginComponent";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { notFound, redirect } from "next/navigation";
import { CookiesList, getCookie } from "@/utils/cookies";
import { Page } from "@/utils/pageTypes";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";

export const metadata: Metadata = {
    title: "Registro - Servicio de Streaming Privado",
    description: "Registrarse en la app de streaming privada.",
    openGraph: {
        title: "Registro - Servicio de Streaming Privado",
        description: "Registrarse en la app de streaming privada.",
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
        title: "Registro - Servicio de Streaming Privado",
        description: "Registrarse en la app de streaming privada.",
        images: ["/kiyohime.webp"],
    },
};

const Register = async ({ searchParams }: Page) => {
    const resolvedSearchParams = await searchParams;
    const invitation = resolvedSearchParams.invitation as string | undefined;

    logData({
        title: "Invitation Token",
        data: invitation,
        layer: "auth_register_token",
        addSeparatorAfter: true,
        addSpaceAfter: true,
    });

    if (
        !isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_REGISTER) ||
        !invitation
    ) {
        return notFound();
    }

    const userCookie = await getCookie(CookiesList.USER);
    const jwtCookie = await getCookie(CookiesList.JWT);

    if (userCookie && jwtCookie) {
        logData({
            title: "User already logged in, redirecting to home",
            layer: "auth_register",
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        redirect("/");
    }

    const platformService = new PlatformService();
    platformService.setJWT(process.env.STRAPI_REGISTER_TOKEN_API_KEY || "");

    const response = await platformService.call(
        "bRegisterTokenGetBRegisterTokens",
        {
            query: {
                filters: {
                    token: {
                        $eq: invitation,
                    },
                    used: {
                        $eq: false,
                    },
                },
            },
        }
    );

    const ticket = response.data?.data[0];

    if (!response.data || !ticket || ticket.used) {
        return notFound();
    }

    return (
        <TicketForm
            isRegisterForm={true}
            ticketCode={ticket.token}
            ticketNumber={ticket.id}
            userName={ticket.user}
            createdAt={new Date(ticket.createdAt)}
        />
    );
};

export default Register;
