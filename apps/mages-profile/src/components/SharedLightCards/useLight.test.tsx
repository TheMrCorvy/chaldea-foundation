import { fireEvent, render, screen } from "@testing-library/react";
import { FC } from "react";
import useLight from "./useLight";

type Rect = Pick<DOMRect, "left" | "top">;

const HookHarness: FC = () => {
    const { containerRef, cardsRef, isHovering, setIsHovering } = useLight();

    return (
        <div>
            <div data-testid="hover-state">{String(isHovering)}</div>
            <button
                data-testid="set-hover-true"
                onClick={() => setIsHovering(true)}
            >
                hover on
            </button>
            <button
                data-testid="set-hover-false"
                onClick={() => setIsHovering(false)}
            >
                hover off
            </button>
            <div data-testid="container" ref={containerRef}>
                <div
                    data-testid="card-1"
                    ref={(element) => {
                        cardsRef.current[0] = element;
                    }}
                />
                <div
                    data-testid="card-2"
                    ref={(element) => {
                        cardsRef.current[1] = element;
                    }}
                />
            </div>
        </div>
    );
};

const mockRect = (element: HTMLElement, rect: Rect) => {
    Object.defineProperty(element, "getBoundingClientRect", {
        configurable: true,
        value: () => ({
            x: rect.left,
            y: rect.top,
            width: 0,
            height: 0,
            top: rect.top,
            right: rect.left,
            bottom: rect.top,
            left: rect.left,
            toJSON: () => ({}),
        }),
    });
};

describe("useLight", () => {
    it("starts with hovering disabled and allows toggling through setter", () => {
        render(<HookHarness />);

        expect(screen.getByTestId("hover-state")).toHaveTextContent("false");

        fireEvent.click(screen.getByTestId("set-hover-true"));
        expect(screen.getByTestId("hover-state")).toHaveTextContent("true");

        fireEvent.click(screen.getByTestId("set-hover-false"));
        expect(screen.getByTestId("hover-state")).toHaveTextContent("false");
    });

    it("updates mouse CSS variables on every registered card during mouse move", () => {
        render(<HookHarness />);

        const container = screen.getByTestId("container");
        const card1 = screen.getByTestId("card-1");
        const card2 = screen.getByTestId("card-2");

        mockRect(card1, { left: 10, top: 20 });
        mockRect(card2, { left: 5, top: 5 });

        fireEvent.mouseMove(container, { clientX: 30, clientY: 50 });

        expect(card1.style.getPropertyValue("--mouse-x")).toBe("20px");
        expect(card1.style.getPropertyValue("--mouse-y")).toBe("30px");
        expect(card2.style.getPropertyValue("--mouse-x")).toBe("25px");
        expect(card2.style.getPropertyValue("--mouse-y")).toBe("45px");
    });
});
