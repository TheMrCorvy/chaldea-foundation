import { render, screen } from "@testing-library/react";

import Invitation from ".";
import useStyles from "./useStyles";

jest.mock("./useStyles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        root: {},
        title: {},
        ticketNumber: {},
        date: {},
        userContainer: {},
        userName: {},
        image: {},
    })),
}));

const mockedUseStyles = jest.mocked(useStyles);

describe("Invitation", () => {
    beforeEach(() => {
        mockedUseStyles.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders invitation details with provided creation date", () => {
        const createdAt = new Date("2026-03-10T12:00:00.000Z");
        const expectedDate = new Intl.DateTimeFormat("es-AR").format(createdAt);

        render(
            <Invitation
                isRegisterForm={false}
                ticketNumber="TK-123"
                createdAt={createdAt}
            />
        );

        expect(
            screen.getByRole("region", {
                name: "Idetalles de la invitación",
            })
        ).toBeInTheDocument();
        expect(screen.getByText("Ticket Número:")).toBeInTheDocument();
        expect(screen.getByText("TK-123")).toBeInTheDocument();
        expect(
            screen.getByText(`Fecha de creación: ${expectedDate}`)
        ).toBeInTheDocument();
        expect(
            screen.getByRole("img", {
                name: "Kiyohime",
            })
        ).toBeInTheDocument();
        expect(screen.queryByText("Jeanne")).not.toBeInTheDocument();
        expect(mockedUseStyles).toHaveBeenCalledWith({
            isRegisterForm: false,
        });
    });

    it("renders user name only when register form is enabled", () => {
        const userName = "Jeanne";

        const { rerender } = render(
            <Invitation
                isRegisterForm
                ticketNumber={999}
                createdAt={new Date("2026-03-11T10:00:00.000Z")}
                userName={userName}
            />
        );

        expect(screen.getByText(userName)).toBeInTheDocument();
        expect(mockedUseStyles).toHaveBeenCalledWith({
            isRegisterForm: true,
        });

        rerender(
            <Invitation
                isRegisterForm={false}
                ticketNumber={999}
                createdAt={new Date("2026-03-11T10:00:00.000Z")}
                userName={userName}
            />
        );

        expect(screen.queryByText(userName)).not.toBeInTheDocument();
    });

    it("uses current date when creation date is not provided", () => {
        const currentDate = new Date("2026-03-12T09:15:00.000Z");
        const expectedDate = new Intl.DateTimeFormat("es-AR").format(
            currentDate
        );

        jest.useFakeTimers();
        jest.setSystemTime(currentDate);

        render(<Invitation isRegisterForm={false} ticketNumber="TK-456" />);

        expect(
            screen.getByText(`Fecha de creación: ${expectedDate}`)
        ).toBeInTheDocument();
    });
});
