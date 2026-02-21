import { fireEvent, render, screen } from "@testing-library/react";
import {
    ElementType,
    HTMLAttributes,
    MutableRefObject,
    ReactNode,
} from "react";
import GlitchText from "./index";
import useGlitchText from "./useGlitchText";

type MockTypographyProps = HTMLAttributes<HTMLElement> & {
    component?: ElementType;
    sx?: unknown;
    children?: ReactNode;
};

jest.mock("@mui/material", () => {
    const ReactModule = require("react") as typeof import("react");

    const stringifySx = (sx: unknown): string => {
        if (sx === null || sx === undefined) {
            return "";
        }

        if (typeof sx === "object") {
            return JSON.stringify(sx);
        }

        return String(sx);
    };

    const Typography = ReactModule.forwardRef<HTMLElement, MockTypographyProps>(
        ({ children, component: Component = "p", sx, ...rest }, ref) =>
            ReactModule.createElement(
                Component,
                {
                    ...rest,
                    ref,
                    "data-sx": stringifySx(sx),
                },
                children
            )
    );

    Typography.displayName = "MockTypography";

    return {
        Typography,
    };
});

jest.mock("./useGlitchText", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockUseGlitchText = useGlitchText as jest.MockedFunction<
    typeof useGlitchText
>;

describe("GlitchText", () => {
    it("renders hook string and forwards hover handler", () => {
        const mockHoverHandler = jest.fn();
        const mockElementRef: MutableRefObject<HTMLDivElement | null> = {
            current: null,
        };

        mockUseGlitchText.mockReturnValue({
            string: "GLITCHED",
            handleHover: mockHoverHandler,
            elementRef: mockElementRef,
        });

        render(<GlitchText text="Mage" data-testid="glitch-text" />);

        const glitchElement = screen.getByTestId("glitch-text");

        expect(glitchElement).toHaveTextContent("GLITCHED");
        expect(mockUseGlitchText).toHaveBeenCalledWith({
            text: "Mage",
            disableHover: true,
            delay: 0,
            characters:
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        });

        fireEvent.mouseEnter(glitchElement);
        expect(mockHoverHandler).toHaveBeenCalledTimes(1);
        expect(glitchElement.getAttribute("data-sx")).toContain(
            '"wordBreak":"break-word"'
        );
    });

    it("respects character options and merges sx prop", () => {
        const mockElementRef: MutableRefObject<HTMLDivElement | null> = {
            current: null,
        };

        mockUseGlitchText.mockReturnValue({
            string: "1234",
            handleHover: jest.fn(),
            elementRef: mockElementRef,
        });

        render(
            <GlitchText
                text="Digits"
                useMayus={false}
                useMinus={false}
                useNumbers={true}
                useSymbols={false}
                disableHover={false}
                delay={2}
                sx={{ color: "red" }}
                data-testid="glitch-text-custom"
            />
        );

        const customElement = screen.getByTestId("glitch-text-custom");

        expect(mockUseGlitchText).toHaveBeenLastCalledWith({
            text: "Digits",
            disableHover: false,
            delay: 2,
            characters: "0123456789",
        });
        expect(customElement.getAttribute("data-sx")).toContain(
            '"color":"red"'
        );
        expect(customElement.getAttribute("data-sx")).toContain(
            '"wordBreak":"break-word"'
        );
    });
});
