import { render, screen } from "@testing-library/react";
import type { LayoutLink } from "@repo/type-definitions/dynamic-page";

// ─── MUI mock ────────────────────────────────────────────────────────────────
jest.mock("@mui/material", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");

    const Link = ({
        children,
        href,
        target,
        rel,
        underline: _u,
        variant: _v,
        sx: _sx,
        color: _c,
        ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        underline?: string;
        variant?: string;
        sx?: unknown;
        color?: string;
    }) => React.createElement("a", { href, target, rel, ...rest }, children);

    const Box = ({
        children,
        component: Component = "div",
        sx: _sx,
        ...rest
    }: React.HTMLAttributes<HTMLElement> & {
        component?: React.ElementType;
        sx?: unknown;
    }) => React.createElement(Component, rest, children);

    return { Link, Box };
});

// ─── IconComponent mock ───────────────────────────────────────────────────────
// Relative path required — @/ alias does not resolve inside jest.mock()
jest.mock("../../../IconComponent", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    return {
        __esModule: true,
        default: ({
            name,
            ...rest
        }: {
            name: string;
            [key: string]: unknown;
        }) =>
            React.createElement("span", {
                "data-testid": `icon-${name}`,
                ...rest,
            }),
    };
});

// ─── Component under test ─────────────────────────────────────────────────────
import DynamicLink from "./index";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const baseIcon: LayoutLink["icon"] = {
    __component: "layout.icon",
    component_id: "icon-1",
    id: 1,
    title: null,
    name: "GitHub",
    size: "medium",
    color: "info",
};

const defaultProps: LayoutLink = {
    __component: "layout.link",
    component_id: "link-1",
    id: 1,
    title: null,
    href: "https://example.com",
    label: "Visit Chaldea",
    variant: "link",
    color: "primary",
    target: "_blank",
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("DynamicLink", () => {
    // ── variant="link" ────────────────────────────────────────────────────────

    it('renders the label as a link for variant="link"', () => {
        render(<DynamicLink {...defaultProps} />);
        expect(
            screen.getByRole("link", { name: "Visit Chaldea" })
        ).toBeInTheDocument();
    });

    it("passes the href to the anchor element", () => {
        render(<DynamicLink {...defaultProps} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "https://example.com"
        );
    });

    it('adds rel="noopener noreferrer" to every link variant', () => {
        render(<DynamicLink {...defaultProps} />);
        expect(screen.getByRole("link")).toHaveAttribute(
            "rel",
            "noopener noreferrer"
        );
    });

    it("passes the target attribute to the anchor element", () => {
        render(<DynamicLink {...defaultProps} target="_blank" />);
        expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
    });

    // ── variant="icon_link" ───────────────────────────────────────────────────

    it('renders the icon inside the link for variant="icon_link"', () => {
        render(
            <DynamicLink
                {...defaultProps}
                variant="icon_link"
                icon={baseIcon}
            />
        );
        expect(screen.getByRole("link")).toBeInTheDocument();
        expect(screen.getByTestId("icon-GitHub")).toBeInTheDocument();
    });

    it('does not render the label text for variant="icon_link"', () => {
        render(
            <DynamicLink
                {...defaultProps}
                variant="icon_link"
                icon={baseIcon}
            />
        );
        expect(screen.queryByText("Visit Chaldea")).not.toBeInTheDocument();
    });

    it("renders an empty link when icon_link has no icon", () => {
        render(
            <DynamicLink
                {...defaultProps}
                variant="icon_link"
                icon={undefined}
            />
        );
        expect(screen.getByRole("link")).toBeInTheDocument();
        expect(screen.queryByTestId(/^icon-/)).not.toBeInTheDocument();
    });

    // ── variant="link_with_icon" ──────────────────────────────────────────────

    it('renders both label and icon for variant="link_with_icon"', () => {
        const docsIcon = { ...baseIcon, name: "MenuBook" };
        render(
            <DynamicLink
                {...defaultProps}
                variant="link_with_icon"
                label="Read the docs"
                icon={docsIcon}
            />
        );
        expect(
            screen.getByRole("link", { name: /Read the docs/i })
        ).toBeInTheDocument();
        expect(screen.getByTestId("icon-MenuBook")).toBeInTheDocument();
    });

    it("renders only the label when link_with_icon has no icon", () => {
        render(
            <DynamicLink
                {...defaultProps}
                variant="link_with_icon"
                icon={undefined}
            />
        );
        expect(screen.getByRole("link")).toBeInTheDocument();
        expect(screen.queryByTestId(/^icon-/)).not.toBeInTheDocument();
    });

    // ── popover ───────────────────────────────────────────────────────────────

    it("wraps the link in a span with aria-label when popover is provided", () => {
        render(<DynamicLink {...defaultProps} popover="Opens in a new tab" />);
        // The Box renders as <span aria-label="Opens in a new tab">
        const link = screen.getByRole("link");
        expect(link.parentElement).toHaveAttribute(
            "aria-label",
            "Opens in a new tab"
        );
    });

    it("also sets data-tooltip to the popover text", () => {
        render(<DynamicLink {...defaultProps} popover="Opens in a new tab" />);
        const link = screen.getByRole("link");
        expect(link.parentElement).toHaveAttribute(
            "data-tooltip",
            "Opens in a new tab"
        );
    });

    it("does not add a popover wrapper when popover is absent", () => {
        render(<DynamicLink {...defaultProps} />);
        const link = screen.getByRole("link");
        expect(link.parentElement).not.toHaveAttribute("aria-label");
    });

    // ── popover + icon variant ────────────────────────────────────────────────

    it("popover wrapper is compatible with icon_link variant", () => {
        render(
            <DynamicLink
                {...defaultProps}
                variant="icon_link"
                icon={baseIcon}
                popover="Go to GitHub"
            />
        );
        const link = screen.getByRole("link");
        expect(link.parentElement).toHaveAttribute(
            "aria-label",
            "Go to GitHub"
        );
        expect(screen.getByTestId("icon-GitHub")).toBeInTheDocument();
    });
});
