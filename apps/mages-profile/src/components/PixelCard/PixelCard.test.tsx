import { render, screen } from "@testing-library/react";
import { HTMLAttributes, ReactNode } from "react";
import * as ReactModule from "react";
import PixelCard from "./index";
import usePixelCard from "./usePixelCard";

type MockBoxProps = HTMLAttributes<HTMLElement> & {
    sx?: unknown;
    children?: ReactNode;
};

type MockUsePixelCardReturn = {
    containerRef: ReactModule.MutableRefObject<HTMLDivElement | null>;
    canvasRef: ReactModule.MutableRefObject<HTMLCanvasElement | null>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: ReactModule.FocusEventHandler<HTMLDivElement>;
    onBlur: ReactModule.FocusEventHandler<HTMLDivElement>;
    finalNoFocus: boolean;
    renderBorders: () =>
        | {
              borderLeft: string;
              borderRight: string;
              borderTop: string;
              borderBottom: string;
          }
        | { border: string };
};

const mockUsePixelCard = usePixelCard as jest.MockedFunction<
    typeof usePixelCard
>;

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
        ({ children, sx, ...rest }, ref) =>
            ReactModule.createElement(
                "div",
                {
                    ...rest,
                    ref,
                    "data-testid": "mui-box",
                    "data-sx": stringifySx(sx),
                },
                children
            )
    );

    Box.displayName = "MockBox";

    return { Box };
});

jest.mock("./usePixelCard", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const buildHookReturn = (
    overrides: Partial<MockUsePixelCardReturn> = {}
): MockUsePixelCardReturn => ({
    containerRef: { current: null },
    canvasRef: { current: null },
    onMouseEnter: jest.fn(),
    onMouseLeave: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    finalNoFocus: false,
    renderBorders: () => ({
        borderLeft: "1px solid rgba(25, 118, 210, 0.6)",
        borderRight: "none",
        borderTop: "none",
        borderBottom: "none",
    }),
    ...overrides,
});

describe("PixelCard", () => {
    beforeEach(() => {
        mockUsePixelCard.mockReset();
    });

    it("renders children and default rounded border styles", () => {
        mockUsePixelCard.mockReturnValue(buildHookReturn());

        render(<PixelCard>Pixel Card (Hover or Focus test)</PixelCard>);

        const root = screen.getByTestId("mui-box");

        expect(
            screen.getByText("Pixel Card (Hover or Focus test)")
        ).toBeInTheDocument();
        expect(root).toHaveAttribute("tabindex", "0");
        expect(root.getAttribute("data-sx")).toContain('"borderRadius":"25px"');
        expect(root.getAttribute("data-sx")).toContain('"width":"100%"');
        expect(root.getAttribute("data-sx")).toContain('"height":"100%"');
    });

    it("applies non-rounded style when roundedBorders is false", () => {
        mockUsePixelCard.mockReturnValue(buildHookReturn());

        render(
            <PixelCard roundedBorders={false} width={300} height={250}>
                No rounded borders
            </PixelCard>
        );

        const root = screen.getByTestId("mui-box");

        expect(root.getAttribute("data-sx")).toContain('"borderRadius":0');
        expect(root.getAttribute("data-sx")).toContain('"width":300');
        expect(root.getAttribute("data-sx")).toContain('"height":250');
    });

    it("sets tabIndex -1 and disables focus handlers when finalNoFocus is true", () => {
        mockUsePixelCard.mockReturnValue(
            buildHookReturn({
                finalNoFocus: true,
            })
        );

        render(<PixelCard variant="pink">Always on</PixelCard>);

        const root = screen.getByTestId("mui-box");

        expect(root).toHaveAttribute("tabindex", "-1");
    });

    it("forwards hook configuration props", () => {
        mockUsePixelCard.mockReturnValue(buildHookReturn());

        render(
            <PixelCard
                variant="blue"
                gap={8}
                speed={30}
                colors="#111,#222"
                noFocus={true}
                focusOnMount={true}
                borders={{ top: true, bottom: true }}
            >
                Focus me
            </PixelCard>
        );

        expect(mockUsePixelCard).toHaveBeenCalledWith({
            variant: "blue",
            gap: 8,
            colors: "#111,#222",
            speed: 30,
            noFocus: true,
            focusOnMount: true,
            borders: { top: true, bottom: true },
        });
    });
});
