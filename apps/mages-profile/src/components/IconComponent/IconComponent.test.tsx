import { render, screen } from "@testing-library/react";
import type { SVGProps } from "react";
import IconComponent from "./index";

type MockIconProps = SVGProps<SVGSVGElement>;

jest.mock("@mui/icons-material", () => {
    const React = jest.requireActual<typeof import("react")>("react");

    const Home = (props: MockIconProps) =>
        React.createElement("svg", { "data-icon-name": "Home", ...props });

    const Favorite = (props: MockIconProps) =>
        React.createElement("svg", {
            "data-icon-name": "Favorite",
            ...props,
        });

    return {
        Home,
        Favorite,
    };
});

describe("IconComponent", () => {
    it("renders the icon component dynamically by icon name", () => {
        render(<IconComponent name="Home" data-testid="home-icon" />);

        const iconElement = screen.getByTestId("home-icon");

        expect(iconElement).toBeInTheDocument();
        expect(iconElement.tagName).toBe("svg");
        expect(iconElement).toHaveAttribute("data-icon-name", "Home");
    });

    it("forwards props to the selected icon", () => {
        render(
            <IconComponent
                name="Favorite"
                data-testid="favorite-icon"
                className="custom-icon"
            />
        );

        const iconElement = screen.getByTestId("favorite-icon");

        expect(iconElement).toHaveClass("custom-icon");
        expect(iconElement).toHaveAttribute("data-icon-name", "Favorite");
    });

    it("returns null when the requested icon does not exist", () => {
        render(
            <IconComponent
                name={"NotAnIcon" as keyof typeof import("@mui/icons-material")}
                data-testid="missing-icon"
            />
        );

        expect(screen.queryByTestId("missing-icon")).not.toBeInTheDocument();
    });
});
