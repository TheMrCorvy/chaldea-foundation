import Image from "next/image";

import kiyohimeImg from "../../../../public/kiyohime.webp";
import { FC } from "react";

interface Props {
    isRegisterForm?: boolean;
    invitationNumber?: number;
    createdAt?: Date;
    userName?: string;
}

const Invitation: FC<Props> = ({
    isRegisterForm,
    invitationNumber,
    createdAt,
    userName,
}) => {
    const ticketNumber = invitationNumber || "x-x-x-x-x";
    const date = createdAt ? new Date(createdAt) : new Date();
    const currentDate = new Intl.DateTimeFormat("es-AR").format(date);

    return (
        <div
            data-testid="invitation-component"
            className={`w-full lg:h-full h-auto ${
                isRegisterForm ? "max-h-[24rem]" : "max-h-[30rem]"
            } lg:max-h-auto lg:w-1/2 border-dashed border-white border-b-3 lg:border-b-0 lg:border-r-3 relative`}
        >
            <Image
                src={kiyohimeImg}
                height={400}
                alt="Kiyohime"
                className={`rotate-0 lg:rotate-0 lg:w-[355px] lg:h-[700px] ${isRegisterForm ? "mt-0" : "mt-[4rem]"} ${isRegisterForm ? "lg:mt-0" : "lg:mt-[3rem]"} xl:mt-0`}
            />
            <div className="absolute top-[5%] right-[5%] text-right flex flex-col gap-6">
                <h4 className="text-3xl lg:text-4xl">
                    Ticket Nº: <span className="font-bold">{ticketNumber}</span>
                </h4>
                <h4 className="text-lg sm:text-xl lg:text-2xl">
                    Fecha de creación: <br />
                    <span className="font-bold">{currentDate}</span>
                </h4>
                {userName && isRegisterForm && (
                    <div className="flex flex-row">
                        <span style={{ flexGrow: 1 }} />
                        <h4 className="text-4xl font-bold capitalize max-w-[7rem] md:max-w-[10rem] lg:max-w-[17rem]">
                            {userName}
                        </h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invitation;
