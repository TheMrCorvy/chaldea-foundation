import { NavbarSection } from "@/components/layout/TopNavigation";
import { navbarItems } from "@/mocks/topNavigationItems";
import { RoleTypes } from "@/types/StrapiSDK";
import { CookiesList, getCookie, UserCookie } from "@/utils/cookies";
import { WebRoutes } from "@/utils/routes";

const generateNavbarItems = () => {
    const userObject = getCookie(CookiesList.USER) as UserCookie | null;

    const newLink: NavbarSection = {
        items: [
            {
                label: "Lista de Animes",
                href: WebRoutes.animesWatched,
            },
        ],
        justify: "start",
    };

    if (
        userObject?.role.type === RoleTypes.ANIME_PAGE_ADMIN &&
        navbarItems.findIndex(
            (item) => item.items?.[0]?.href === WebRoutes.animesWatched
        ) === -1
    ) {
        navbarItems.splice(1, 0, newLink);
    }

    return navbarItems;
};

export default generateNavbarItems;
