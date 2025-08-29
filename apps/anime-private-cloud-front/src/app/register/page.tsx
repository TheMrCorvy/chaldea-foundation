import { notFound, redirect } from "next/navigation";

import MainContainer from "@/components/layout/MainContainer";
import SignInTicket from "@/components/SignInTicket";
import { Page } from "@/types/nextjs";
import { StrapiService } from "@/services/StrapiService";
import { CookiesList, getCookie } from "@/utils/cookies";
import { WebRoutes } from "@/utils/routes";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@/services/featureFlagService";
import { Fragment } from "react";

export default async function Register({ searchParams }: Page) {
    if (!isFeatureFlagEnabled(FeatureNames.ENABLE_USERS_REGISTER)) {
        return notFound();
    }

    const jwt = await getCookie(CookiesList.JWT);
    const user = await getCookie(CookiesList.USER);

    if (jwt || user) {
        return redirect(WebRoutes.home);
    }

    const invitationCode = searchParams.invitation as string | undefined;

    if (!invitationCode) {
        return notFound();
    }

    const service = StrapiService();
    const token = await service.validateRegisterToken({
        token: invitationCode,
        queryParams: {
            filters: {
                token: {
                    $contains: invitationCode,
                },
                used: {
                    $eq: false,
                },
            },
        },
    });

    if (token.data === null || token.data[0]?.used || !token.data[0]) {
        return notFound();
    }

    return (
        <main className="absolute flex flex-col justify-center min-h-[100%] w-full bg-slate-900 pt-16">
            <MainContainer>
                <Fragment>
                    <h1 className="absolute top-[-5rem] left-0 w-full text-lg sm:text-xl md:text-3xl text-center font-bold">
                        Has sido invitado/a a ver anime en FULL-HD en esta
                        plataforma exclusiva
                    </h1>
                    <SignInTicket
                        isRegisterForm
                        registerToken={{ ...token.data[0] }}
                    />
                </Fragment>
            </MainContainer>
        </main>
    );
}
