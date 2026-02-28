import { render, screen } from "@testing-library/react";
import HologramGlitchText from "./index";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

interface MockTypographyProps extends ComponentPropsWithoutRef<"span"> {
    component?: ElementType;
    children?: ReactNode;
}

jest.mock("@mui/material", () => {
    const React = jest.requireActual<typeof import("react")>("react");

    const Typography = React.forwardRef<HTMLElement, MockTypographyProps>(
        ({ component: Component = "span", children, ...rest }, ref) => {
            return React.createElement(Component, { ...rest, ref }, children);
        }
    );

    Typography.displayName = "MockTypography";

    return {
        Typography,
    };
});

describe("HologramGlitchText", () => {
    it("renders the provided text with glitch class and data-text attribute", () => {
        render(
            <HologramGlitchText data-testid="hologram-text">
                Hologram Glitch
            </HologramGlitchText>
        );

        const textElement = screen.getByTestId("hologram-text");

        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveTextContent("Hologram Glitch");
        expect(textElement).toHaveClass("glitch");
        expect(textElement).toHaveAttribute("data-text", "Hologram Glitch");
    });

    it("forwards typography props to the underlying component", () => {
        render(
            <HologramGlitchText component="h2" data-testid="hologram-heading">
                Styled Heading
            </HologramGlitchText>
        );

        const headingElement = screen.getByTestId("hologram-heading");

        expect(headingElement.tagName).toBe("H2");
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
            "Styled Heading"
        );
    });
});
