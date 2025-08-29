import { FC } from "react";
import { Input, Button } from "@nextui-org/react";
import { StrapiService } from "@/services/StrapiService";
import { RegisterResponse, LoginResponse, RoleTypes } from "@/types/StrapiSDK";
import { CookiesList, setCookie } from "@/utils/cookies";
import { notFound, redirect } from "next/navigation";
import { WebRoutes } from "@/utils/routes";

import { Fragment } from "react";

interface Props {
    isRegisterForm: boolean;
    tokenId?: string;
    errorMessage?: string;
}

const SignInForm: FC<Props> = ({ isRegisterForm, tokenId, errorMessage }) => {
    const handleSubmit = async (formData: FormData) => {
        "use server";
        const service = StrapiService();

        let serverResponse: RegisterResponse | LoginResponse;

        if (isRegisterForm) {
            serverResponse = await service.register({
                email: formData.get("email") as string,
                username: formData.get("username") as string,
                password: formData.get("password") as string,
            });
        } else {
            serverResponse = await service.login({
                identifier: formData.get("identifier") as string,
                password: formData.get("password") as string,
            });
        }

        if (!serverResponse.ok || serverResponse.error) {
            console.error(serverResponse.error);
            console.log(serverResponse.error?.message);

            if (
                serverResponse.error?.name &&
                serverResponse.error?.name === "ValidationError"
            ) {
                return redirect(
                    `${WebRoutes.login}?rejectionReason=${serverResponse.error?.message}`
                );
            } else {
                return notFound();
            }
        }

        const userWithRole = await service.me({
            jwt: serverResponse.jwt,
            queryParams: {
                populate: "role",
            },
        });

        setCookie(CookiesList.JWT, { jwt: serverResponse.jwt });
        setCookie(CookiesList.USER, userWithRole);

        if (isRegisterForm) {
            await service.invalidateRegisterToken({
                tokenId: tokenId as string,
            });
        }

        if (
            !("role" in userWithRole) ||
            (userWithRole.role.type !== RoleTypes.ADULT_ANIME_WATCHER &&
                userWithRole.role.type !== RoleTypes.ANIME_WATCHER &&
                userWithRole.role.type !== RoleTypes.ANIME_PAGE_ADMIN)
        ) {
            return redirect(WebRoutes.pendingUserActivation);
        }

        return redirect(WebRoutes.home);
    };

    const inputs = () => {
        if (isRegisterForm) {
            return (
                <Fragment>
                    <Input
                        isRequired
                        type="text"
                        label="Nombre de usuario"
                        className="max-w-xs"
                        color="danger"
                        name="username"
                    />
                    <Input
                        isRequired
                        type="email"
                        label="Email"
                        className="max-w-xs"
                        color="danger"
                        name="email"
                        data-testid="sign-in-email"
                    />
                    <Input
                        isRequired
                        type="password"
                        label="Contraseña"
                        className="max-w-xs"
                        color="danger"
                        name="password"
                    />
                </Fragment>
            );
        }

        return (
            <Fragment>
                <Input
                    isRequired
                    type="text"
                    label="Email o Usuario"
                    className="max-w-xs"
                    color="danger"
                    name="identifier"
                    data-testid="sign-in-identifier"
                />
                <Input
                    isRequired
                    type="password"
                    label="Contraseña"
                    className="max-w-xs"
                    color="danger"
                    name="password"
                />
            </Fragment>
        );
    };

    return (
        <Fragment>
            <div
                data-testid="sign-in-form"
                className="w-full lg:h-full h-4/12 lg:w-4/12 border-dashed border-white border-t-3 lg:border-t-0 lg:border-l-3"
            >
                <form
                    action={handleSubmit}
                    className="flex flex-col h-full gap-6 p-6 justify-center items-center text-center content-center"
                >
                    {inputs()}
                    {errorMessage && <p>{errorMessage}</p>}
                    <Button color="danger" type="submit">
                        Ingresar
                    </Button>
                </form>
            </div>
        </Fragment>
    );
};

export default SignInForm;
