import { render, screen } from "@testing-library/react";

import QR from ".";
import useStyles from "./useStyles";

jest.mock("./useStyles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        root: {},
        verticalText: {},
        qrContainer: {},
        invitationText: {},
        invitationCode: {},
        qrStyles: {},
    })),
}));

jest.mock("./PunchHoles", () => ({
    __esModule: true,
    default: () => <div data-testid="punch-holes" />,
}));

jest.mock("react-qr-code", () => ({
    __esModule: true,
    default: ({ value, size }: { value: string; size?: number }) => (
        <div
            data-size={size ? String(size) : ""}
            data-testid="qr-code"
            data-value={value}
        />
    ),
}));

const mockedUseStyles = jest.mocked(useStyles);

describe("QR", () => {
    beforeEach(() => {
        mockedUseStyles.mockClear();
    });

    it("renders invitation QR details and passes value to QR code", () => {
        const value = "INV-AX92";

        render(<QR value={value} />);

        expect(
            screen.getByRole("region", {
                name: "Código QR de la invitación",
            })
        ).toBeInTheDocument();
        expect(screen.getByText("VÁLIDO POR UN USO")).toBeInTheDocument();
        expect(screen.getByText("CÓDIGO DE INVITACIÓN")).toBeInTheDocument();

        const qrCode = screen.getByTestId("qr-code");
        expect(qrCode).toHaveAttribute("data-value", value);
        expect(qrCode).toHaveAttribute("data-size", "150");

        expect(screen.getAllByText(value)).toHaveLength(2);
        expect(screen.getByTestId("punch-holes")).toBeInTheDocument();
        expect(mockedUseStyles).toHaveBeenCalledTimes(1);
    });
});
