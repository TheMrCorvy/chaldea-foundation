import { render, screen } from "@testing-library/react";
import { ElementType, HTMLAttributes, ReactNode } from "react";
import * as ReactModule from "react";
import StarryContainer from "./index";

type MockBoxProps = HTMLAttributes<HTMLElement> & {
    component?: ElementType;
    sx?: unknown;
    children?: ReactNode;
};

type MotionDivProps = HTMLAttributes<HTMLDivElement> & {
    style?: ReactModule.CSSProperties;
    animate?: { opacity: number[] };
    transition?: {
        duration: number;
        repeat: number;
        repeatType: "loop";
    };
    children?: ReactNode;
};

const stringifySx = (sx: unknown): string => {
    if (sx === null || sx === undefined) {
        return "";
    }

    if (typeof sx === "object") {
        return JSON.stringify(sx);
    }

    return String(sx);
};

jest.mock("@mui/material", () => {
    const Box = ReactModule.forwardRef<HTMLElement, MockBoxProps>(
        ({ children, component: Component = "div", sx, ...rest }, ref) =>
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

    Box.displayName = "MockBox";

    return { Box };
});

jest.mock("framer-motion", () => {
    const MotionDiv = ReactModule.forwardRef<HTMLDivElement, MotionDivProps>(
        ({ children, animate, transition, ...rest }, ref) => {
            void animate;
            void transition;

            return ReactModule.createElement(
                "div",
                {
                    ...rest,
                    ref,
                    "data-testid": "star",
                },
                children
            );
        }
    );

    MotionDiv.displayName = "MockMotionDiv";

    return {
        motion: {
            div: MotionDiv,
        },
    };
});

describe("StarryContainer", () => {
    it("renders children content centered inside a main container", () => {
        render(
            <StarryContainer>
                <span>Inner content</span>
            </StarryContainer>
        );

        expect(screen.getByText("Inner content")).toBeInTheDocument();

        const main = screen.getByRole("main");
        expect(main).toBeInTheDocument();
        expect(main).toHaveAttribute("data-sound", "button");
        expect(main.getAttribute("data-sx")).toContain('"height":"100dvh"');
    });

    it("renders all star particles from the predefined star list", () => {
        render(
            <StarryContainer>
                <span>Child</span>
            </StarryContainer>
        );

        expect(screen.getAllByTestId("star")).toHaveLength(19);
    });
});
