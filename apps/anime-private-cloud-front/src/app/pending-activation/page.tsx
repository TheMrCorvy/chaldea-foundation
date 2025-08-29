import { redirect } from "next/navigation";

import { CookiesList, getCookie, JwtCookie, UserCookie } from "@/utils/cookies";
import { WebRoutes } from "@/utils/routes";

import MainContainer from "@/components/layout/MainContainer";
import { RoleTypes } from "@/types/StrapiSDK";
import TopNavigation from "@/components/layout/TopNavigation";
import { pendingActivationNavbar } from "@/mocks/topNavigationItems";

export default async function PendingUserActivation() {
    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
    const user = (await getCookie(CookiesList.USER)) as UserCookie | null;

    if (!jwt || !user) {
        return redirect(WebRoutes.login);
    }

    if (
        user.role &&
        (user.role.type === RoleTypes.ADULT_ANIME_WATCHER ||
            user.role.type === RoleTypes.ANIME_WATCHER ||
            user.role.type === RoleTypes.ANIME_PAGE_ADMIN)
    ) {
        return redirect(WebRoutes.home);
    }

    return (
        <main className="absolute flex flex-col justify-center min-h-[100%] w-full bg-slate-900 pt-16">
            <TopNavigation
                navbarSections={pendingActivationNavbar}
                position="static"
                className="h-16 bg-slate-800 text-white fixed top-0 right-0"
            />
            <MainContainer>
                <section className="flex flex-col justify-center text-center w-full gap-8">
                    <h1 className="left-0 w-full text-5xl text-center font-bold">
                        Tu cuenta fue registrada con éxito!
                    </h1>
                    <h4 className="w-full text-xl text-center">
                        Ponte en contacto con el administrador del sitio para
                        activar tu cuenta y poder acceder a todo el contenido.
                    </h4>
                </section>
            </MainContainer>
        </main>
    );
}
