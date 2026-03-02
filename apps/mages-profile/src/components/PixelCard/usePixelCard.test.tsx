import { fireEvent, render, screen } from "@testing-library/react";
import { FC } from "react";
import usePixelCard, { UsePixelCardProps } from "./usePixelCard";

type MatchMediaResult = {
    matches: boolean;
    media: string;
    onchange: ((event: MediaQueryListEvent) => void) | null;
    addListener: (listener: (event: MediaQueryListEvent) => void) => void;
    removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
    addEventListener: (
        type: "change",
        listener: (event: MediaQueryListEvent) => void
    ) => void;
    removeEventListener: (
        type: "change",
        listener: (event: MediaQueryListEvent) => void
    ) => void;
    dispatchEvent: (event: Event) => boolean;
};

class ResizeObserverMock implements ResizeObserver {
    observe(target: Element): void {
        void target;
    }

    unobserve(target: Element): void {
        void target;
    }

    disconnect(): void {}
}

const HookHarness: FC<UsePixelCardProps> = (props) => {
    const {
        containerRef,
        canvasRef,
        onMouseEnter,
        onMouseLeave,
        onFocus,
        onBlur,
        finalNoFocus,
        renderBorders,
    } = usePixelCard(props);

    return (
        <div>
            <div
                data-testid="pixel-card-root"
                ref={containerRef}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onFocus={onFocus}
                onBlur={onBlur}
                tabIndex={0}
            >
                <canvas data-testid="pixel-card-canvas" ref={canvasRef} />
            </div>
            <div data-testid="final-no-focus">{String(finalNoFocus)}</div>
            <div data-testid="borders">{JSON.stringify(renderBorders())}</div>
            <button data-testid="outside-button">outside</button>
        </div>
    );
};

const originalMatchMedia = window.matchMedia;
const originalResizeObserver = window.ResizeObserver;
const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;
const originalCanvasGetContext = HTMLCanvasElement.prototype.getContext;

const clearRectMock = jest.fn<void, [number, number, number, number]>();
const fillRectMock = jest.fn<void, [number, number, number, number]>();

const canvasContextMock = {
    clearRect: clearRectMock,
    fillRect: fillRectMock,
    fillStyle: "",
} as unknown as CanvasRenderingContext2D;

const requestAnimationFrameMock = jest.fn<number, [FrameRequestCallback]>();
const cancelAnimationFrameMock = jest.fn<void, [number]>();

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: (query: string): MatchMediaResult => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => undefined,
            removeListener: () => undefined,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            dispatchEvent: () => false,
        }),
    });

    Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: ResizeObserverMock,
    });

    requestAnimationFrameMock.mockImplementation(() => 1);
    cancelAnimationFrameMock.mockImplementation(() => undefined);

    Object.defineProperty(window, "requestAnimationFrame", {
        configurable: true,
        writable: true,
        value: requestAnimationFrameMock,
    });

    Object.defineProperty(window, "cancelAnimationFrame", {
        configurable: true,
        writable: true,
        value: cancelAnimationFrameMock,
    });

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        configurable: true,
        writable: true,
        value: (contextId: string): CanvasRenderingContext2D | null => {
            if (contextId === "2d") {
                return canvasContextMock;
            }

            return null;
        },
    });
});

afterEach(() => {
    requestAnimationFrameMock.mockClear();
    cancelAnimationFrameMock.mockClear();
    clearRectMock.mockClear();
    fillRectMock.mockClear();
});

afterAll(() => {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: originalMatchMedia,
    });

    Object.defineProperty(window, "ResizeObserver", {
        configurable: true,
        writable: true,
        value: originalResizeObserver,
    });

    Object.defineProperty(window, "requestAnimationFrame", {
        configurable: true,
        writable: true,
        value: originalRequestAnimationFrame,
    });

    Object.defineProperty(window, "cancelAnimationFrame", {
        configurable: true,
        writable: true,
        value: originalCancelAnimationFrame,
    });

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
        configurable: true,
        writable: true,
        value: originalCanvasGetContext,
    });
});

describe("usePixelCard", () => {
    it("uses variant default focus behavior and default side borders", () => {
        render(<HookHarness variant="default" />);

        expect(screen.getByTestId("final-no-focus")).toHaveTextContent("false");
        expect(screen.getByTestId("borders")).toHaveTextContent(
            JSON.stringify({
                borderLeft: "1px solid rgba(25, 118, 210, 0.6)",
                borderRight: "1px solid rgba(25, 118, 210, 0.6)",
                borderTop: "none",
                borderBottom: "none",
            })
        );
    });

    it("disables all borders when borders is false", () => {
        render(<HookHarness variant="blue" borders={false} />);

        expect(screen.getByTestId("borders")).toHaveTextContent(
            JSON.stringify({ border: "none" })
        );
    });

    it("enables only configured directional borders", () => {
        render(<HookHarness borders={{ top: true, bottom: true }} />);

        expect(screen.getByTestId("borders")).toHaveTextContent(
            JSON.stringify({
                borderLeft: "none",
                borderRight: "none",
                borderTop: "1px solid rgba(25, 118, 210, 0.6)",
                borderBottom: "1px solid rgba(25, 118, 210, 0.6)",
            })
        );
    });

    it("uses noFocus=true from pink variant and allows override", () => {
        const { rerender } = render(<HookHarness variant="pink" />);

        expect(screen.getByTestId("final-no-focus")).toHaveTextContent("true");

        rerender(<HookHarness variant="pink" noFocus={false} />);

        expect(screen.getByTestId("final-no-focus")).toHaveTextContent("false");
    });

    it("starts animation on mount when focusOnMount is true", () => {
        render(<HookHarness focusOnMount={true} />);

        expect(requestAnimationFrameMock).toHaveBeenCalled();
    });

    it("starts hover/focus animation handlers", () => {
        render(<HookHarness />);

        const root = screen.getByTestId("pixel-card-root");
        const outsideButton = screen.getByTestId("outside-button");

        fireEvent.mouseEnter(root);
        fireEvent.mouseLeave(root);
        fireEvent.focus(root, { relatedTarget: outsideButton });
        fireEvent.blur(root, { relatedTarget: outsideButton });

        expect(requestAnimationFrameMock).toHaveBeenCalled();
    });
});
