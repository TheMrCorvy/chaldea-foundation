import { act, fireEvent, render, screen } from "@testing-library/react";
import DynamicTitle from "./index";

import React from "react";

jest.mock("framer-motion", () => {
    const MotionDiv = ({
        children,
        ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
        initial?: unknown;
        animate?: unknown;
        whileInView?: unknown;
        viewport?: unknown;
        transition?: unknown;
    }) => React.createElement("div", rest, children);

    return { motion: { div: MotionDiv } };
});

jest.mock("@mui/material", () => {
    type MockProps = React.HTMLAttributes<HTMLElement> & {
        children?: React.ReactNode;
        component?: React.ElementType;
        sx?: unknown;
        color?: string;
        size?: string;
        title?: string;
        placement?: string;
        arrow?: boolean;
    };

    const Box = ({
        children,
        component: Component = "div",
        ...rest
    }: MockProps) => React.createElement(Component as string, rest, children);

    const IconButton = ({ children, ...rest }: MockProps) =>
        React.createElement("button", rest, children);

    const Tooltip = ({ children, title }: MockProps) =>
        React.createElement(
            "span",
            { "data-tooltip-title": title as string },
            children
        );

    return { Box, IconButton, Tooltip };
});

jest.mock("@mui/icons-material/Add", () => {
    const AddIcon = (props: React.SVGAttributes<SVGElement>) =>
        React.createElement("svg", { "data-testid": "add-icon", ...props });
    AddIcon.displayName = "AddIcon";
    return { __esModule: true, default: AddIcon };
});

jest.mock("@mui/icons-material/Link", () => {
    const LinkIcon = (props: React.SVGAttributes<SVGElement>) =>
        React.createElement("svg", { "data-testid": "link-icon", ...props });
    LinkIcon.displayName = "LinkIcon";
    return { __esModule: true, default: LinkIcon };
});

jest.mock("../../../GlitchText", () => {
    const GlitchText = ({
        text,
        ...rest
    }: {
        text: string;
        color?: unknown;
        fontSize?: unknown;
        textAlign?: unknown;
        sx?: unknown;
        delay?: unknown;
        disableHover?: unknown;
        useMinus?: unknown;
        useSymbols?: unknown;
        variant?: unknown;
        cycles?: unknown;
    } & React.HTMLAttributes<HTMLSpanElement>) =>
        React.createElement("span", rest, text);
    GlitchText.displayName = "GlitchText";
    return { __esModule: true, default: GlitchText };
});

jest.mock("../DynamicLink", () => {
    const DynamicLink = ({ label }: { label: string }) =>
        React.createElement("a", { "data-testid": "dynamic-link" }, label);
    DynamicLink.displayName = "DynamicLink";
    return { __esModule: true, default: DynamicLink };
});

const mockWriteText = jest.fn().mockResolvedValue(undefined);

describe("DynamicTitle", () => {
    beforeEach(() => {
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText: mockWriteText },
            writable: true,
            configurable: true,
        });
        mockWriteText.mockClear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders the title text", () => {
        render(<DynamicTitle id={1} title="Section Title" />);

        expect(screen.getByText("Section Title")).toBeInTheDocument();
    });

    it("renders the section anchor with the correct id", () => {
        const { container } = render(
            <DynamicTitle id={42} title="My Section" />
        );

        expect(container.querySelector("#section-42")).toBeInTheDocument();
    });

    it("does not render DynamicLink when link_to_page is not provided", () => {
        render(<DynamicTitle id={1} title="No Link" />);

        expect(screen.queryByTestId("dynamic-link")).not.toBeInTheDocument();
    });

    it("renders DynamicLink when link_to_page is provided", () => {
        render(
            <DynamicTitle
                id={1}
                title="With Link"
                link_to_page={{
                    id: 0,
                    __component: "layout.link",
                    component_id: "link-1",
                    title: "Go",
                    href: "/page",
                    label: "Navigate",
                    variant: "link",
                    target: "_self",
                }}
            />
        );

        expect(screen.getByTestId("dynamic-link")).toBeInTheDocument();
        expect(screen.getByText("Navigate")).toBeInTheDocument();
    });

    it("calls navigator.clipboard.writeText with a URL containing the section id on copy click", () => {
        render(<DynamicTitle id={7} title="Copy Test" />);

        fireEvent.click(screen.getByRole("button"));

        expect(mockWriteText).toHaveBeenCalledWith(
            expect.stringContaining("#section-7")
        );
    });

    it("shows 'Copied!' in the tooltip after clicking the copy button", () => {
        render(<DynamicTitle id={1} title="Tooltip Test" />);

        const button = screen.getByRole("button");
        const tooltipWrapper = button.closest("[data-tooltip-title]");

        expect(tooltipWrapper).toHaveAttribute(
            "data-tooltip-title",
            "Copy link to section"
        );

        fireEvent.click(button);

        expect(tooltipWrapper).toHaveAttribute("data-tooltip-title", "Copied!");
    });

    it("resets the tooltip back to default text after 2 seconds", () => {
        render(<DynamicTitle id={1} title="Timer Test" />);

        const button = screen.getByRole("button");
        const tooltipWrapper = button.closest("[data-tooltip-title]");

        fireEvent.click(button);
        expect(tooltipWrapper).toHaveAttribute("data-tooltip-title", "Copied!");

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(tooltipWrapper).toHaveAttribute(
            "data-tooltip-title",
            "Copy link to section"
        );
    });

    it("uses the custom popover text in the tooltip when provided", () => {
        render(
            <DynamicTitle
                id={1}
                title="Custom Popover"
                popover="Jump to this section"
            />
        );

        const tooltipWrapper = screen
            .getByRole("button")
            .closest("[data-tooltip-title]");

        expect(tooltipWrapper).toHaveAttribute(
            "data-tooltip-title",
            "Jump to this section"
        );
    });

    it("renders corner AddIcons", () => {
        render(<DynamicTitle id={1} title="Corner Icons" />);

        const addIcons = screen.getAllByTestId("add-icon");
        expect(addIcons).toHaveLength(2);
    });
});
