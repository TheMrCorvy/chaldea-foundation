import { NavbarSection } from "@/components/layout/TopNavigation";
import SessionHandlerComponent from "@/components/layout/SessionHandlerComponent";
import SearchInput from "@/components/SearchInput";
import { WebRoutes } from "@/utils/routes";

export const navbarItems: NavbarSection[] = [
    {
        items: [
            {
                label: "Inicio",
                href: WebRoutes.home,
            },
        ],
        justify: "start",
        className: "items-center hidden sm:flex gap-4",
    },
    {
        items: [
            {
                label: "Buscar",
                href: WebRoutes.search,
                children: <SearchInput />,
            },
        ],
        className: "",
        justify: "center",
    },
    {
        items: [
            {
                label: "Login",
                href: WebRoutes.login,
                children: <SessionHandlerComponent />,
            },
        ],
        className: "hidden sm:flex gap-4 flex",
        justify: "end",
    },
];

export const pendingActivationNavbar: NavbarSection[] = [
    {
        items: [
            {
                label: "Login",
                href: WebRoutes.login,
                children: <SessionHandlerComponent />,
            },
        ],
        className: "hidden sm:flex gap-4 flex",
        justify: "end",
    },
];

export const navbarItemsTest: NavbarSection[] = [
    {
        items: [
            {
                label: "Home",
                href: WebRoutes.home,
            },
        ],
        justify: "start",
        className: "hidden sm:flex gap-4",
    },
    {
        items: [
            {
                label: "Buscar",
                href: WebRoutes.search,
            },
        ],
        justify: "center",
        className: "hidden sm:flex gap-4",
    },
    {
        items: [
            {
                label: "Login",
                href: WebRoutes.login,
            },
        ],
        justify: "end",
        className: "hidden sm:flex gap-4",
    },
];
