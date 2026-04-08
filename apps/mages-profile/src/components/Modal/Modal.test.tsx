import { fireEvent, render, screen } from "@testing-library/react";
import {
    ElementType,
    HTMLAttributes,
    PropsWithChildren,
    ReactNode,
    SVGProps,
} from "react";
import * as ReactModule from "react";
import Modal from "./index";

type MockBoxProps = HTMLAttributes<HTMLElement> & {
    component?: ElementType;
    sx?: unknown;
    children?: ReactNode;
};

type MockGridProps = HTMLAttributes<HTMLElement> & {
    component?: ElementType;
    container?: boolean;
    size?: number | { xs: number; sm: number; md: number };
    spacing?: number;
    sx?: unknown;
    children?: ReactNode;
};

type MotionDivProps = HTMLAttributes<HTMLDivElement> & {
    onAnimationStart?: () => void;
    onAnimationComplete?: () => void;
    children?: ReactNode;
};

const stringifyValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
};

jest.mock("@mui/material", () => {
    const Box = ReactModule.forwardRef<HTMLElement, MockBoxProps>(
        ({ children, component: Component = "div", sx, ...rest }, ref) =>
            ReactModule.createElement(
                Component,
                {
                    ...rest,
                    ref,
                    "data-sx": stringifyValue(sx),
                },
                children
            )
    );

    const Grid = ReactModule.forwardRef<HTMLElement, MockGridProps>(
        (
            {
                children,
                component: Component = "div",
                container,
                size,
                spacing,
                sx,
                ...rest
            },
            ref
        ) =>
            ReactModule.createElement(
                Component,
                {
                    ...rest,
                    ref,
                    "data-container": container ? "true" : "false",
                    "data-size": stringifyValue(size),
                    "data-spacing": stringifyValue(spacing),
                    "data-sx": stringifyValue(sx),
                },
                children
            )
    );

    Box.displayName = "MockBox";
    Grid.displayName = "MockGrid";

    return { Box, Grid };
});

jest.mock("framer-motion", () => {
    const MotionDiv = ReactModule.forwardRef<HTMLDivElement, MotionDivProps>(
        ({ children, onAnimationStart, onAnimationComplete, ...rest }, ref) => {
            ReactModule.useEffect(() => {
                onAnimationStart?.();
                onAnimationComplete?.();
            }, [onAnimationStart, onAnimationComplete]);

            return ReactModule.createElement("div", { ...rest, ref }, children);
        }
    );

    MotionDiv.displayName = "MockMotionDiv";

    const AnimatePresence = ({ children }: PropsWithChildren) =>
        ReactModule.createElement(ReactModule.Fragment, null, children);

    return {
        AnimatePresence,
        motion: {
            div: MotionDiv,
        },
    };
});

jest.mock("../GlitchBacgkroundCard", () => ({
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => (
        <div data-testid="glitch-card">{children}</div>
    ),
}));

jest.mock("../PixelCard", () => ({
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => (
        <div data-testid="pixel-card">{children}</div>
    ),
}));

jest.mock("@mui/icons-material/Add", () => ({
    __esModule: true,
    default: (props: SVGProps<SVGSVGElement>) => (
        <svg data-testid="add-icon" {...props} />
    ),
}));

const findOverlay = (container: HTMLElement): HTMLElement => {
    const overlay = Array.from(container.querySelectorAll("[data-sx]"))
        .filter(
            (element): element is HTMLElement => element instanceof HTMLElement
        )
        .find((element) => {
            const sx = element.getAttribute("data-sx") ?? "";
            return (
                sx.includes('"maxHeight":"100dvh"') &&
                sx.includes('"width":"100dvw"')
            );
        });

    if (!overlay) {
        throw new Error("Modal overlay was not rendered");
    }

    return overlay;
};

describe("Modal", () => {
    it("does not render content when open is false", () => {
        render(
            <Modal open={false} isMobile={false} onExit={jest.fn()}>
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
        expect(screen.queryByTestId("glitch-card")).not.toBeInTheDocument();
        expect(screen.queryByTestId("pixel-card")).not.toBeInTheDocument();
    });

    it("renders desktop variant with GlitchBackgroundCard when open", () => {
        render(
            <Modal open isMobile={false} onExit={jest.fn()}>
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.getByTestId("glitch-card")).toBeInTheDocument();
        expect(screen.getByText("Modal Content")).toBeInTheDocument();
        expect(screen.queryByTestId("pixel-card")).not.toBeInTheDocument();
    });

    it("renders mobile variant with PixelCard and corner icons", () => {
        render(
            <Modal open isMobile onExit={jest.fn()}>
                <div>Modal Content (Mobile)</div>
            </Modal>
        );

        expect(screen.getByTestId("pixel-card")).toBeInTheDocument();
        expect(screen.getByText("Modal Content (Mobile)")).toBeInTheDocument();
        expect(screen.queryByTestId("glitch-card")).not.toBeInTheDocument();
        expect(screen.getAllByTestId("add-icon")).toHaveLength(4);
    });

    it("calls onExit when clicking the overlay", () => {
        const onExit = jest.fn();
        const { container } = render(
            <Modal open isMobile={false} onExit={onExit}>
                <div>Modal Content</div>
            </Modal>
        );

        fireEvent.click(findOverlay(container));

        expect(onExit).toHaveBeenCalledTimes(1);
    });
});
