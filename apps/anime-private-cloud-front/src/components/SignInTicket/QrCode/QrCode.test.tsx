import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import QrCode from ".";

describe("QrCode", () => {
    it("should render properly", () => {
        render(<QrCode isRegisterForm={false} value={"Invitation"} />);

        const qrCodeComponent = screen.queryByTestId("qr-code-component");

        expect(qrCodeComponent).toBeInTheDocument();
    });

    it("should render properly with invitation number", () => {
        render(
            <QrCode
                isRegisterForm={true}
                value="Invitation"
                invitationNumber={2}
            />
        );

        const ticketComponent = screen.queryByTestId("qr-code-component");

        expect(ticketComponent).toBeInTheDocument();
    });
});
