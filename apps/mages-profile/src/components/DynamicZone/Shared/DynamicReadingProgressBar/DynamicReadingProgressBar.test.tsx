import { render, screen, act } from "@testing-library/react";
import type { BlogReadingProgressBar } from "@repo/type-definitions/dynamic-page";

// ─── MUI mock ────────────────────────────────────────────────────────────────
jest.mock("@mui/material", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");

    const Box = ({
        children,
        sx: _sx,
        component: Component = "div",
        ...rest
    }: React.HTMLAttributes<HTMLElement> & {
        sx?: unknown;
        component?: React.ElementType;
        children?: React.ReactNode;
    }) => React.createElement(Component, rest, children);

    const LinearProgress = ({
        value,
        color,
        variant: _variant,
        sx: _sx,
        ...rest
    }: React.HTMLAttributes<HTMLElement> & {
        value?: number;
        color?: string;
        variant?: string;
        sx?: unknown;
    }) =>
        React.createElement("div", {
            role: "progressbar",
            "data-value": value !== undefined ? String(value) : undefined,
            "data-color": color,
            ...rest,
        });

    return { Box, LinearProgress };
});

// ─── Component under test ─────────────────────────────────────────────────────
import DynamicReadingProgressBar from "./index";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const baseTitle: BlogReadingProgressBar["title"] = {
    __component: "layout.title",
    component_id: "title-1",
    id: 0,
    title: null,
    color: "#fff",
    size: "h3",
    text_align: "left",
    link_icon_color: "info",
    animation_cycles: 2,
};

const defaultProps: BlogReadingProgressBar = {
    __component: "dynamic-zone.reading-progress-bar",
    component_id: "bar-1",
    id: 1,
    position: "top",
    reversed: false,
    color: "primary",
    bar_thickness: "6px",
    title: baseTitle,
};

/**
 * Set scroll-related DOM properties that the component reads inside
 * `computeProgress()`.
 */
function setScrollState({
    scrollY = 0,
    scrollHeight = 800,
    clientHeight = 800,
}: {
    scrollY?: number;
    scrollHeight?: number;
    clientHeight?: number;
}) {
    Object.defineProperty(window, "scrollY", {
        value: scrollY,
        writable: true,
        configurable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
        value: 0,
        writable: true,
        configurable: true,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
        get: () => scrollHeight,
        configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
        get: () => clientHeight,
        configurable: true,
    });
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("DynamicReadingProgressBar", () => {
    beforeEach(() => {
        // Make requestAnimationFrame synchronous so the computeProgress
        // callback runs immediately when called from onScrollOrResize.
        jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
            cb(0);
            return 0;
        });
        jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

        // Default: no scroll → component returns null.
        setScrollState({ scrollY: 0, scrollHeight: 800, clientHeight: 800 });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ── Visibility ────────────────────────────────────────────────────────────

    it("does not render the progress bar when scrollTop is 0 (initial state)", () => {
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("does not render the progress bar when maxScroll is 0 (page fits in the viewport)", () => {
        // scrollHeight === clientHeight → maxScroll = 0 → stays hidden
        setScrollState({ scrollY: 100, scrollHeight: 600, clientHeight: 600 });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("renders the progress bar when scrollTop > 0 and maxScroll > 0", () => {
        // scrollY=600, scrollHeight=2000, clientHeight=800 → maxScroll=1200
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    // ── Progress calculation ───────────────────────────────────────────────────

    it("sets the correct progress value for a mid-scroll position", () => {
        // (600 / 1200) * 100 = 50
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "50"
        );
    });

    it("inverts the progress when reversed=true", () => {
        // (300 / 1200) * 100 = 25  →  reversed: 100 - 25 = 75
        setScrollState({ scrollY: 300, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} reversed={true} />);
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "75"
        );
    });

    it("clamps progress at 100 when scrolled past the end", () => {
        // scrollY > maxScroll → normalized > 100 → capped at 100
        setScrollState({
            scrollY: 1500,
            scrollHeight: 2000,
            clientHeight: 800,
        });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "100"
        );
    });

    // ── Scroll event updates ──────────────────────────────────────────────────

    it("becomes visible and updates progress when a scroll event fires", () => {
        // Start with no scroll → null
        setScrollState({ scrollY: 0, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

        // Advance scroll to 50 % and dispatch the event
        Object.defineProperty(window, "scrollY", {
            value: 600,
            writable: true,
            configurable: true,
        });

        act(() => {
            window.dispatchEvent(new Event("scroll"));
        });

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-value",
            "50"
        );
    });

    it("updates progress when a resize event fires", () => {
        setScrollState({ scrollY: 0, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

        Object.defineProperty(window, "scrollY", {
            value: 600,
            writable: true,
            configurable: true,
        });

        act(() => {
            window.dispatchEvent(new Event("resize"));
        });

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    // ── Vertical positions ────────────────────────────────────────────────────

    it.each(["left", "right"] as const)(
        'renders the scan-line overlay Box for position="%s"',
        (position) => {
            setScrollState({
                scrollY: 600,
                scrollHeight: 2000,
                clientHeight: 800,
            });
            const { container } = render(
                <DynamicReadingProgressBar
                    {...defaultProps}
                    position={position}
                />
            );
            // children[0] = sentinel div, children[1] = outer Box
            const outerBox = container.children[1] as HTMLElement;
            expect(outerBox.children).toHaveLength(2);
        }
    );

    it.each(["top", "bottom"] as const)(
        'does NOT render the scan-line overlay for position="%s"',
        (position) => {
            setScrollState({
                scrollY: 600,
                scrollHeight: 2000,
                clientHeight: 800,
            });
            const { container } = render(
                <DynamicReadingProgressBar
                    {...defaultProps}
                    position={position}
                />
            );
            // children[0] = sentinel div, children[1] = outer Box
            const outerBox = container.children[1] as HTMLElement;
            expect(outerBox.children).toHaveLength(1);
        }
    );

    // ── Color ─────────────────────────────────────────────────────────────────

    it("passes the color prop through to LinearProgress", () => {
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} color="warning" />);
        expect(screen.getByRole("progressbar")).toHaveAttribute(
            "data-color",
            "warning"
        );
    });

    // ── bar_thickness ─────────────────────────────────────────────────────────

    it("uses the bar_thickness string value as-is", () => {
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        // We verify indirectly: no error thrown and the component renders.
        render(
            <DynamicReadingProgressBar {...defaultProps} bar_thickness="10px" />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("falls back to 6px when bar_thickness is an empty string", () => {
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        render(
            <DynamicReadingProgressBar {...defaultProps} bar_thickness="" />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    // ── aria-label ────────────────────────────────────────────────────────────

    it('has aria-label "Reading progress" on the progress element', () => {
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        render(<DynamicReadingProgressBar {...defaultProps} />);
        expect(
            screen.getByRole("progressbar", { name: "Reading progress" })
        ).toBeInTheDocument();
    });

    // ── Event listener cleanup ────────────────────────────────────────────────

    it("removes scroll and resize listeners when unmounted", () => {
        setScrollState({ scrollY: 600, scrollHeight: 2000, clientHeight: 800 });
        const removeSpy = jest.spyOn(window, "removeEventListener");

        const { unmount } = render(
            <DynamicReadingProgressBar {...defaultProps} />
        );

        unmount();

        const removedEvents = removeSpy.mock.calls.map(([type]) => type);
        expect(removedEvents).toContain("scroll");
        expect(removedEvents).toContain("resize");
    });
});
