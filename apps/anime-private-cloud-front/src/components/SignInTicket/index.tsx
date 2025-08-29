import { FC } from "react";

import SignInForm from "./SignInForm";
import Invitation from "./Invitation";
import QrCode from "./QrCode";
import { RegisterToken } from "@/types/StrapiSDK";

export interface Props {
    isRegisterForm?: boolean;
    registerToken?: RegisterToken;
    error?: string;
}

const SignInTicket: FC<Props> = ({ isRegisterForm, registerToken, error }) => {
    return (
        <section
            data-testid="sign-in-ticket"
            className="bg-pink-400 shadow-xl mb-[35rem] lg:mb-0 shadow-slate-800/90 w-[20rem] lg:h-[20rem] h-full lg:w-full rounded-3xl overflow-hidden flex flex-col justify-center lg:flex-row lg:justify-start relative padding-5"
        >
            <Invitation
                isRegisterForm={isRegisterForm}
                invitationNumber={registerToken?.id}
                createdAt={registerToken?.createdAt}
                userName={registerToken?.user}
            />

            <QrCode
                isRegisterForm={isRegisterForm || false}
                value={
                    isRegisterForm && registerToken
                        ? registerToken.token
                        : "Invitation"
                }
                invitationNumber={registerToken?.id}
            />

            <div
                className={`bg-slate-800 absolute h-12 w-12 rounded-3xl ${!isRegisterForm ? "top-[49%]" : "top-[40%]"} lg:top-[-1.5rem] -left-[1.5rem] lg:left-[48.4%]`}
            ></div>
            <div
                className={`bg-slate-800 absolute h-12 w-12 rounded-3xl ${!isRegisterForm ? "bottom-[25%]" : "bottom-[35%]"} lg:bottom-[-1.5rem] -left-[1.5rem] lg:left-[48.4%]`}
            ></div>

            <SignInForm
                isRegisterForm={isRegisterForm || false}
                tokenId={registerToken?.documentId}
                errorMessage={error}
            />

            <div
                className={`bg-slate-800 absolute h-12 w-12 rounded-3xl ${!isRegisterForm ? "bottom-[25%]" : "bottom-[35%]"} lg:bottom-[-1.5rem] -right-[1.5rem] lg:left-[65%]`}
            ></div>
            <div
                className={`bg-slate-800 absolute h-12 w-12 rounded-3xl ${!isRegisterForm ? "top-[49%]" : "top-[40%]"} lg:top-[-1.5rem] -right-[1.5rem] lg:left-[65%]`}
            ></div>
        </section>
    );
};

export default SignInTicket;
