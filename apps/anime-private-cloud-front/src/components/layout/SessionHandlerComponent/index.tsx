import { FC } from "react";

import { Button, Link } from "@nextui-org/react";
import { CookiesList, getCookie, removeCookie } from "@/utils/cookies";
import { redirect } from "next/navigation";

import { WebRoutes } from "@/utils/routes";

const SessionHandlerComponent: FC = async () => {
    const session = await getCookie(CookiesList.USER);

    const handleLogout = async () => {
        "use server";

        removeCookie(CookiesList.USER);
        removeCookie(CookiesList.JWT);

        redirect(WebRoutes.login);
    };

    if (session) {
        return (
            <form action={handleLogout}>
                <Button color="primary" type="submit" variant="flat">
                    Cerrar Sesión
                </Button>
            </form>
        );
    }

    return (
        <Button as={Link} href={WebRoutes.login} color="primary" variant="flat">
            Login
        </Button>
    );
};

export default SessionHandlerComponent;
