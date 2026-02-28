import { render, screen } from "@testing-library/react";
import type {
    ComponentPropsWithoutRef,
    ElementType,
    HTMLAttributes,
    ReactNode,
} from "react";
import MagesData from "./index";

interface MockBoxProps extends ComponentPropsWithoutRef<"div"> {
    component?: ElementType;
    sx?: unknown;
    children?: ReactNode;
}

interface MockDividerProps extends ComponentPropsWithoutRef<"hr"> {
    sx?: unknown;
}

interface MockGlitchTextProps extends HTMLAttributes<HTMLSpanElement> {
    text: string;
    variant?: string;
}

jest.mock("@mui/material", () => {
    const React = jest.requireActual<typeof import("react")>("react");

    const Box = React.forwardRef<HTMLElement, MockBoxProps>(
        ({ component: Component = "div", children, ...rest }, ref) => {
            return React.createElement(Component, { ...rest, ref }, children);
        }
    );

    const Divider = React.forwardRef<HTMLHRElement, MockDividerProps>(
        ({ ...rest }, ref) => {
            return React.createElement("hr", { ...rest, ref });
        }
    );

    Box.displayName = "MockBox";
    Divider.displayName = "MockDivider";

    return {
        Box,
        Divider,
    };
});

jest.mock("framer-motion", () => ({
    motion: {
        div: "div",
    },
}));

jest.mock("../GlitchText", () => {
    const MockGlitchText = ({ text, variant }: MockGlitchTextProps) => (
        <span data-testid={`glitch-${text}`} data-variant={variant}>
            {text}
        </span>
    );

    return {
        __esModule: true,
        default: MockGlitchText,
    };
});

describe("MagesData", () => {
    const baseProps = {
        name: "Gonzalo Salvador Corvalan",
        position: "Fullstack developer",
        profile_image: "/profile.png",
        commands: "/commands.png",
    };

    it("renders mage identity data and images", () => {
        render(<MagesData {...baseProps} />);

        expect(screen.getByText(baseProps.name)).toBeInTheDocument();
        expect(screen.getByText(baseProps.position)).toBeInTheDocument();

        const profileImage = screen.getByAltText("Profile");
        const commandSpellsImage = screen.getByAltText("Command Spells");

        expect(profileImage).toHaveAttribute("src", baseProps.profile_image);
        expect(commandSpellsImage).toHaveAttribute("src", baseProps.commands);
    });

    it("uses desktop text variants when isMobile is false", () => {
        render(<MagesData {...baseProps} isMobile={false} />);

        expect(screen.getByText(baseProps.name)).toHaveAttribute(
            "data-variant",
            "h4"
        );
        expect(screen.getByText(baseProps.position)).toHaveAttribute(
            "data-variant",
            "h6"
        );
    });

    it("uses mobile text variants when isMobile is true", () => {
        render(<MagesData {...baseProps} isMobile />);

        expect(screen.getByText(baseProps.name)).toHaveAttribute(
            "data-variant",
            "h6"
        );
        expect(screen.getByText(baseProps.position)).toHaveAttribute(
            "data-variant",
            "subtitle1"
        );
    });
});
