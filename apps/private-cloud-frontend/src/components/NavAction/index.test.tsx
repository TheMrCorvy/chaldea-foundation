import { fireEvent, render, screen } from "@testing-library/react";

import NavAction from ".";
import useStyles from "./useStyles";

jest.mock("./useStyles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        root: {},
        button: {},
        actionLabel: {},
        iconStyles: {},
    })),
}));

const mockedUseStyles = jest.mocked(useStyles);

describe("NavAction", () => {
    beforeEach(() => {
        mockedUseStyles.mockClear();
    });

    it("renders label and icon", () => {
        render(
            <NavAction
                label="Inicio"
                icon={<span data-testid="nav-action-icon">icon</span>}
                value="home"
                onClick={jest.fn<void, [string]>()}
            />
        );

        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.getByTestId("nav-action-icon")).toBeInTheDocument();
    });

    it("calls onClick with the provided value", () => {
        const onClick = jest.fn<void, [string]>();

        render(
            <NavAction
                label="Buscar"
                icon={<span>icon</span>}
                value="search"
                onClick={onClick}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /buscar/i }));

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith("search");
    });

    it("passes selected state to useStyles based on value", () => {
        const onClick = jest.fn<void, [string]>();

        render(
            <>
                <NavAction
                    label="Inicio"
                    icon={<span>home</span>}
                    value="home"
                    onClick={onClick}
                />
                <NavAction
                    label="Explorar"
                    icon={<span>explore</span>}
                    value="explore"
                    onClick={onClick}
                />
            </>
        );

        expect(mockedUseStyles).toHaveBeenNthCalledWith(1, {
            isSelected: true,
        });
        expect(mockedUseStyles).toHaveBeenNthCalledWith(2, {
            isSelected: false,
        });
    });
});
