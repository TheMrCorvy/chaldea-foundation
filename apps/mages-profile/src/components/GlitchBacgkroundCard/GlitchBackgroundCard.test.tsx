import { fireEvent, render, screen } from "@testing-library/react";
import { ElementType, HTMLAttributes, ReactNode } from "react";
import * as ReactModule from "react";
import GlitchBackgroundCard from "./index";

type MockBoxProps = HTMLAttributes<HTMLElement> & {
    component?: ElementType;
    sx?: unknown;
    children?: ReactNode;
};

jest.mock("@mui/material", () => {
    const stringifySx = (sx: unknown): string => {
        if (sx === null || sx === undefined) {
            return "";
        }

        if (typeof sx === "object") {
            return JSON.stringify(sx);
        }

        return String(sx);
    };

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

jest.mock("@mui/icons-material/Add", () => ({
    __esModule: true,
    default: () => <span data-testid="add-icon">+</span>,
}));

jest.mock(
    "@/hooks/useRandomString",
    () => ({
        __esModule: true,
        default: () => ({
            build: () => "AB12",
        }),
    }),
    { virtual: true }
);

class ResizeObserverMock implements ResizeObserver {
    observe(_target: Element): void {}

    unobserve(_target: Element): void {}

    disconnect(): void {}
}

const originalResizeObserver = window.ResizeObserver;
const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth"
);

const getGlitchTextLayer = (container: HTMLElement): HTMLElement => {
    const layer = Array.from(container.querySelectorAll("div")).find(
        (element) =>
            (element.getAttribute("data-sx") ?? "").includes(
                '"whiteSpace":"pre"'
            )
    );

    if (!layer) {
        throw new Error("Glitch text layer was not rendered");
    }

    return layer;
};

beforeAll(() => {
    Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: ResizeObserverMock,
    });

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get: () => 140,
    });
});

afterAll(() => {
    Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: originalResizeObserver,
    });

    if (originalClientWidthDescriptor) {
        Object.defineProperty(
            HTMLElement.prototype,
            "clientWidth",
            originalClientWidthDescriptor
        );
    }
});

describe("GlitchBackgroundCard", () => {
    it("renders children and corner icons", () => {
        render(
            <GlitchBackgroundCard>
                <div>Card content</div>
            </GlitchBackgroundCard>
        );

        expect(screen.getByText("Card content")).toBeInTheDocument();
        expect(screen.getAllByTestId("add-icon")).toHaveLength(4);
    });

    it("generates glitch text on hover and updates mouse-position gradient", () => {
        const { container } = render(
            <GlitchBackgroundCard>
                <div>Interactive</div>
            </GlitchBackgroundCard>
        );

        const root = container.firstElementChild;
        if (!root) {
            throw new Error("Root element was not rendered");
        }

        const glitchLayer = getGlitchTextLayer(container);
        expect(glitchLayer.textContent).toBe("");

        fireEvent.mouseEnter(root);
        expect(glitchLayer.textContent).not.toBe("");

        fireEvent.mouseMove(root, { clientX: 30, clientY: 40 });
        expect(glitchLayer.getAttribute("data-sx")).toContain("30px 40px");
    });

    it("starts with generated glitch text when mobile mode is enabled", () => {
        const { container } = render(
            <GlitchBackgroundCard isMobile>
                <div>Mobile card</div>
            </GlitchBackgroundCard>
        );

        const glitchLayer = getGlitchTextLayer(container);
        expect(glitchLayer.textContent).not.toBe("");
    });
});
