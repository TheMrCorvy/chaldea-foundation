import { act, fireEvent, render, screen } from "@testing-library/react";
import { FC, RefObject } from "react";
import useGlitchText, { UseGlitchTextProps } from "./useGlitchText";

type UseInViewSignature = (
    ref: RefObject<Element | null>,
    options?: { once?: boolean }
) => boolean;

const mockUseInView: jest.MockedFunction<UseInViewSignature> = jest.fn();

jest.mock("motion/react", () => ({
    useInView: (ref: RefObject<Element | null>, options?: { once?: boolean }) =>
        mockUseInView(ref, options),
}));

const HookHarness: FC<UseGlitchTextProps> = ({
    text,
    characters,
    delay,
    disableHover,
}) => {
    const { string, handleHover, elementRef } = useGlitchText({
        text,
        characters,
        delay,
        disableHover,
    });

    return (
        <div>
            <div ref={elementRef} data-testid="hook-ref" />
            <button onMouseEnter={handleHover} data-testid="hover-trigger">
                Hover
            </button>
            <span data-testid="glitch-string">{string}</span>
        </div>
    );
};

describe("useGlitchText", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(Math, "random").mockReturnValue(0);
        mockUseInView.mockReset();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it("keeps original text when hover is disabled", () => {
        mockUseInView.mockReturnValue(false);

        render(
            <HookHarness
                text="HELLO"
                characters="XYZ"
                disableHover={true}
                delay={0}
            />
        );

        const output = screen.getByTestId("glitch-string");
        const hoverTrigger = screen.getByTestId("hover-trigger");

        expect(output).toHaveTextContent("HELLO");

        fireEvent.mouseEnter(hoverTrigger);

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(output).toHaveTextContent("HELLO");
        expect(mockUseInView).toHaveBeenCalledWith(expect.any(Object), {
            once: true,
        });
    });

    it("iterates on hover when enabled and finishes on original text", () => {
        mockUseInView.mockReturnValue(false);

        render(
            <HookHarness
                text="ABCD"
                characters="Z"
                disableHover={false}
                delay={0}
            />
        );

        const output = screen.getByTestId("glitch-string");
        const hoverTrigger = screen.getByTestId("hover-trigger");

        fireEvent.mouseEnter(hoverTrigger);

        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(output.textContent).toBe("AZZZ");

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(output).toHaveTextContent("ABCD");
    });

    it("starts animation when in view and delay elapses", () => {
        mockUseInView.mockReturnValue(true);

        render(
            <HookHarness
                text="CODE"
                characters="X"
                disableHover={true}
                delay={1}
            />
        );

        const output = screen.getByTestId("glitch-string");

        expect(output).toHaveTextContent("CODE");

        act(() => {
            jest.advanceTimersByTime(999);
        });

        expect(output).toHaveTextContent("CODE");

        act(() => {
            jest.advanceTimersByTime(51);
        });

        expect(output.textContent).toBe("CODE");

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(output).toHaveTextContent("CODE");
    });
});
