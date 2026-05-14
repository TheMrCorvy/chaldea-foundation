import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import type { JsonRichText } from "@repo/type-definitions/dynamic-page";
import RichTextRenderer, { RichTextRendererProps } from "./index";

const meta = {
    title: "Components/RichTextRenderer",
    render: (args: RichTextRendererProps) => <RichTextRenderer {...args} />,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "Renders structured rich-text content with common blocks and inline styles.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        content: { control: "object" },
    },
} satisfies Meta<RichTextRendererProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseContent: JsonRichText[] = [
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

export const Default: Story = {
    args: {
        content: baseContent,
    },
    render: (args) => (
        <Box sx={{ maxWidth: 720, px: 3, py: 4 }}>
            <RichTextRenderer {...args} />
        </Box>
    ),
};

export const Minimal: Story = {
    args: {
        content: [
            {
                type: "paragraph",
                children: [{ type: "text", text: "Short note." }],
            },
        ],
    },
    render: (args) => (
        <Box sx={{ maxWidth: 520, px: 3, py: 4 }}>
            <RichTextRenderer {...args} />
        </Box>
    ),
};
