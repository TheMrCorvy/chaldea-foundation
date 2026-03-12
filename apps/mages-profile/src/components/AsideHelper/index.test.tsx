import { fireEvent, render, screen } from "@testing-library/react";
import {
    CSSProperties,
    HTMLAttributes,
    PropsWithChildren,
    ReactNode,
} from "react";
import * as ReactModule from "react";

import AsideHelper from "./index";

type MotionAsideProps = HTMLAttributes<HTMLElement> & {
    style?: CSSProperties;
    variants?: unknown;
    initial?: string;
    animate?: string;
    children?: ReactNode;
};

type MotionDivProps = HTMLAttributes<HTMLDivElement> & {
    variants?: unknown;
    children?: ReactNode;
};

jest.mock("framer-motion", () => {
    const MotionAside = ReactModule.forwardRef<HTMLElement, MotionAsideProps>(
        ({ children, style, variants, initial, animate, ...rest }, ref) =>
            ReactModule.createElement(
                "aside",
                {
                    ...rest,
                    ref,
                    style,
                    "data-testid": "motion-aside",
                    "data-initial": initial ?? "",
                    "data-animate": animate ?? "",
                    "data-has-variants": variants ? "true" : "false",
                },
                children
            )
    );

    const MotionDiv = ReactModule.forwardRef<HTMLDivElement, MotionDivProps>(
        ({ children, variants, ...rest }, ref) =>
            ReactModule.createElement(
                "div",
                {
                    ...rest,
                    ref,
                    "data-testid": "motion-div",
                    "data-has-variants": variants ? "true" : "false",
                },
                children
            )
    );

    MotionAside.displayName = "MockMotionAside";
    MotionDiv.displayName = "MockMotionDiv";

    return {
        motion: {
            aside: MotionAside,
            div: MotionDiv,
        },
    };
});

jest.mock("../ToggleSound", () => ({
    __esModule: true,
    default: () => <div data-testid="toggle-sound" />,
}));

type MockHologramGlitchTextProps = PropsWithChildren<{
    sx?: unknown;
    variant?: string;
}>;

jest.mock("../HologramGlitchText", () => ({
    __esModule: true,
    default: ({ children }: MockHologramGlitchTextProps) => (
        <span data-testid="hologram-text">{children}</span>
    ),
}));

type MockGlitchButtonProps = {
    onClick: () => void;
    label: string;
    active?: boolean;
};

jest.mock("../GlitchButton", () => ({
    __esModule: true,
    default: ({ onClick, label, active }: MockGlitchButtonProps) => (
        <button
            aria-label={label}
            data-active={active ? "true" : "false"}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    ),
}));

describe("AsideHelper", () => {
    it("renders helper sections and handles country click", () => {
        const handleClick = jest.fn();

        render(
            <AsideHelper
                markedCountries={["Japan", "Argentina"]}
                handleClick={handleClick}
                countrySelected="Japan"
                isMobile={false}
                isVisible
            />
        );

        expect(screen.getByTestId("toggle-sound")).toBeInTheDocument();
        expect(screen.getByTestId("hologram-text")).toBeInTheDocument();
        expect(
            screen.getByText("Exploratio anima in cosmi somniorum")
        ).toBeInTheDocument();

        const japanButton = screen.getByRole("button", { name: "Japan" });
        const argentinaButton = screen.getByRole("button", {
            name: "Argentina",
        });

        expect(japanButton).toHaveAttribute("data-active", "true");
        expect(argentinaButton).toHaveAttribute("data-active", "false");

        fireEvent.click(argentinaButton);
        expect(handleClick).toHaveBeenCalledWith("Argentina");
        expect(handleClick).toHaveBeenCalledTimes(1);

        const asides = screen.getAllByTestId("motion-aside");
        expect(asides).toHaveLength(3);
        asides.forEach((aside) => {
            expect(aside).toHaveAttribute("data-animate", "visible");
            expect(aside).toHaveStyle({ pointerEvents: "auto" });
        });
    });

    it("applies hidden interaction style when not visible on mobile", () => {
        render(
            <AsideHelper
                markedCountries={["Chile"]}
                handleClick={jest.fn()}
                countrySelected={null}
                isMobile
                isVisible={false}
            />
        );

        const asides = screen.getAllByTestId("motion-aside");

        asides.forEach((aside) => {
            expect(aside).toHaveAttribute("data-animate", "exit");
            expect(aside).toHaveStyle({ pointerEvents: "none" });
        });

        expect(asides[0]).toHaveStyle({ top: "10px", left: "10px" });
        expect(asides[1]).toHaveStyle({ top: "75%", left: "50%" });
    });
});
