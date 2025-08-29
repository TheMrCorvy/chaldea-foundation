import { redirect } from "next/navigation";

import { CookiesList, getCookie } from "@/utils/cookies";
import { WebRoutes } from "@/utils/routes";

import MainContainer from "@/components/layout/MainContainer";
import SignInTicket from "@/components/SignInTicket";
import { Fragment } from "react";
import { Page } from "@/types/nextjs";

export default async function Login({ searchParams }: Page) {
    const jwt = await getCookie(CookiesList.JWT);
    const user = await getCookie(CookiesList.USER);

    if (jwt || user) {
        return redirect(WebRoutes.home);
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
                        error={
                            searchParams.rejectionReason as string | undefined
                        }
                    />
                </Fragment>
            </MainContainer>
        </main>
    );
}
