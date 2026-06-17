import { render, screen } from "@testing-library/react";
import type { JsonRichText } from "@repo/type-definitions/dynamic-page";
import { ElementType, HTMLAttributes, ReactNode } from "react";
import * as ReactModule from "react";
import RichTextRenderer from "./index";

type MockBoxProps = HTMLAttributes<HTMLElement> & {
    component?: ElementType;
    children?: ReactNode;
};

type MockTypographyProps = HTMLAttributes<HTMLElement> & {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1";
    paragraph?: boolean;
    gutterBottom?: boolean;
    fontWeight?: number;
    fontStyle?: string;
    children?: ReactNode;
};

type MockListProps = HTMLAttributes<HTMLUListElement> & {
    children?: ReactNode;
};

type MockListItemProps = HTMLAttributes<HTMLLIElement> & {
    children?: ReactNode;
};

type MockLinkProps = ReactModule.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children?: ReactNode;
};

const isHeadingVariant = (
    variant: MockTypographyProps["variant"]
): variant is "h1" | "h2" | "h3" | "h4" | "h5" | "h6" =>
    variant === "h1" ||
    variant === "h2" ||
    variant === "h3" ||
    variant === "h4" ||
    variant === "h5" ||
    variant === "h6";

jest.mock("@mui/material", () => {
    const Box = ReactModule.forwardRef<HTMLElement, MockBoxProps>(
        ({ children, component: Component = "div", ...rest }, ref) =>
            ReactModule.createElement(Component, { ...rest, ref }, children)
    );

    const Typography = ReactModule.forwardRef<HTMLElement, MockTypographyProps>(
        (
            {
                children,
                variant,
                paragraph,
                gutterBottom: _gutterBottom,
                fontWeight: _fontWeight,
                fontStyle: _fontStyle,
                ...rest
            },
            ref
        ) => {
            let Component: ElementType = "span";

            if (paragraph) {
                Component = "p";
            } else if (isHeadingVariant(variant)) {
                Component = variant;
            }

            return ReactModule.createElement(
                Component,
                { ...rest, ref },
                children
            );
        }
    );

    const List = ReactModule.forwardRef<HTMLUListElement, MockListProps>(
        ({ children, ...rest }, ref) =>
            ReactModule.createElement("ul", { ...rest, ref }, children)
    );

    const ListItem = ReactModule.forwardRef<HTMLLIElement, MockListItemProps>(
        ({ children, ...rest }, ref) =>
            ReactModule.createElement("li", { ...rest, ref }, children)
    );

    const Link = ReactModule.forwardRef<HTMLAnchorElement, MockLinkProps>(
        ({ children, ...rest }, ref) =>
            ReactModule.createElement("a", { ...rest, ref }, children)
    );

    Box.displayName = "MockBox";
    Typography.displayName = "MockTypography";
    List.displayName = "MockList";
    ListItem.displayName = "MockListItem";
    Link.displayName = "MockLink";

    return {
        Box,
        Typography,
        Link,
        List,
        ListItem,
    };
});

const defaultContent: JsonRichText[] = [
    {
        type: "heading",
        level: 2,
        children: [{ type: "text", text: "Profile Summary" }],
    },
    {
        type: "paragraph",
        children: [
            {
                type: "text",
                text: "Specializes in building resilient systems with a focus on ",
            },
            { type: "text", text: "performance", bold: true },
            { type: "text", text: " and " },
            { type: "text", text: "clarity", italic: true },
            { type: "text", text: "." },
        ],
    },
    {
        type: "paragraph",
        children: [
            { type: "text", text: "Uses " },
            { type: "text", text: "TypeScript", code: true },
            { type: "text", text: " and " },
            { type: "text", text: "React", underline: true },
            { type: "text", text: " for UI work." },
        ],
    },
    {
        type: "list",
        children: [
            {
                type: "list-item",
                children: [
                    {
                        type: "paragraph",
                        children: [
                            { type: "text", text: "Architected platform APIs" },
                        ],
                    },
                ],
            },
            {
                type: "list-item",
                children: [
                    {
                        type: "paragraph",
                        children: [
                            { type: "text", text: "Shipped design systems" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        type: "quote",
        children: [
            {
                type: "text",
                text: "Make it work. Make it right. Make it fast.",
            },
        ],
    },
    {
        type: "paragraph",
        children: [
            { type: "text", text: "See more at " },
            {
                type: "link",
                url: "https://example.com",
                children: [{ type: "text", text: "example.com" }],
            },
            { type: "text", text: "." },
        ],
    },
];

describe("RichTextRenderer", () => {
    it("renders structured content from the default story", () => {
        render(<RichTextRenderer content={defaultContent} />);

        expect(
            screen.getByRole("heading", { level: 2, name: "Profile Summary" })
        ).toBeInTheDocument();

        const boldText = screen.getByText("performance");
        expect(boldText.closest("strong")).not.toBeNull();

        const italicText = screen.getByText("clarity");
        expect(italicText.closest("em")).not.toBeNull();

        const codeText = screen.getByText("TypeScript");
        expect(codeText.closest("code")).not.toBeNull();

        const underlinedText = screen.getByText("React");
        expect(underlinedText.closest("u")).not.toBeNull();

        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(
            screen.getByText("Make it work. Make it right. Make it fast.")
        ).toBeInTheDocument();

        const link = screen.getByRole("link", { name: "example.com" });
        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders minimal paragraph content", () => {
        render(
            <RichTextRenderer
                content={[
                    {
                        type: "paragraph",
                        children: [{ type: "text", text: "Short note." }],
                    },
                ]}
            />
        );

        expect(screen.getByText("Short note.")).toBeInTheDocument();
    });

    it("renders code block content with plainText and language (Strapi v5 format)", () => {
        render(
            <RichTextRenderer
                content={[
                    {
                        type: "code",
                        plainText: "const testValue = 42;",
                        language: "javascript",
                    },
                ]}
            />
        );

        const preElement = document.querySelector("pre");
        expect(preElement).toBeInTheDocument();
        expect(preElement?.textContent).toContain("const testValue = 42;");
        expect(screen.getByText("javascript")).toBeInTheDocument();
    });

    it("renders code block content with children nodes (fallback format)", () => {
        render(
            <RichTextRenderer
                content={[
                    {
                        type: "code",
                        children: [
                            {
                                type: "text",
                                text: "import React from 'react';",
                            },
                        ],
                        language: "typescript",
                    },
                ]}
            />
        );

        const preElement = document.querySelector("pre");
        expect(preElement).toBeInTheDocument();
        expect(preElement?.textContent).toContain("import React from 'react';");
        expect(screen.getByText("typescript")).toBeInTheDocument();
    });
});
