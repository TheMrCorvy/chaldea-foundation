"use client";

import { FC } from "react";
import Barcode from "react-barcode";

interface Props {
    isRegisterForm: boolean;
    value: string;
    invitationNumber?: number;
}

const QrCode: FC<Props> = ({ isRegisterForm, value, invitationNumber }) => {
    const date = new Date();
    const currentDate = new Intl.DateTimeFormat("es-AR").format(date);

    const renderInvitationNumber = () => {
        if (isRegisterForm && invitationNumber) {
            return invitationNumber;
        }

        return "x-x-x-x-x";
    };

    return (
        <div
            data-testid="qr-code-component"
            className="w-full lg:h-full h-1/6 lg:w-1/6 border-dashed border-white bg-white border-y-3 lg:border-y-0 lg:border-x-3 flex justify-center items-center text-center text-black"
        >
            <div className="lg:-rotate-90">
                {process.env.NODE_ENV !== "test" && <Barcode value={value} />}
                <p className="text-sm">
                    Invitation Nº:{" "}
                    <span className="font-bold">
                        {renderInvitationNumber()}
                    </span>{" "}
                    - {currentDate}
                </p>
            </div>
        </div>
    );
};

export default QrCode;
