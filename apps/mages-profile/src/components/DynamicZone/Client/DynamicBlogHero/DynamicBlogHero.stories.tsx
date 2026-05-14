import type { Meta, StoryObj } from "@storybook/react";
import type { BlogHero } from "@repo/type-definitions/dynamic-page";
import DynamicBlogHero from "./index";
import StarryContainer from "../../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicBlogHero",
    render: (args: BlogHero) => <DynamicBlogHero {...args} />,
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "space",
            values: [
                {
                    name: "space",
                    value: "#010813",
                },
                {
                    name: "chaldea-light",
                    value: "#e0f2fe",
                },
            ],
        },
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <StarryContainer>
                <Story />
            </StarryContainer>
        ),
    ],
} satisfies Meta<BlogHero>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFormat = {
    name: "chaldea_base.png",
    hash: "chaldea_hash",
    ext: ".png",
    mime: "image/png",
    path: null,
    width: 600,
    height: 400,
    size: 200,
    sizeInBytes: 200000,
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop",
};

const mockCoverImage = {
    documentId: "doc-123",
    id: 123,
    alternativeText: "Chaldea hologram image",
    caption: "Chaldea observer",
    formats: {
        thumbnail: mockFormat,
        small: mockFormat,
        medium: mockFormat,
        large: mockFormat,
    },
    name: "chaldea_base.png",
    hash: "chaldea_hash",
    ext: ".png",
    mime: "image/png",
    width: 1920,
    height: 1080,
    size: 2048,
    sizeInBytes: 2048000,
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
};

export const Default: Story = {
    args: {
        component_id: "1",
        id: 1,
        __component: "dynamic-zone.blog-hero",
        title: "Title of the component",
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Initializing Master protocol... Subject ready. Prepare for the upcoming singular singularity. Welcome back to ",
                    },
                    {
                        type: "text",
                        text: "Chaldea",
                        bold: true,
                    },
                    {
                        type: "text",
                        text: ".",
                    },
                ],
            },
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Your destiny is intertwined with the stars. Humanity's future resides in your command spells.",
                        italic: true,
                    },
                ],
            },
        ],
        cover_image: mockCoverImage,
        link_to_page: {
            __component: "layout.link",
            component_id: "link-1",
            title: "Commence Transfer",
            href: "/transfer",
            label: "Initiate RayShift",
            variant: "link",
            target: "_self",
            id: 0,
        },
    },
};

export const NoImage: Story = {
    args: {
        component_id: "2",
        id: 2,
        __component: "dynamic-zone.blog-hero",
        title: null,
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Simulating hologram stream... Warning, visual data stream corrupted or not found. Falling back to analog display modes.",
                    },
                ],
            },
        ],
        link_to_page: {
            id: 0,
            __component: "layout.link",
            component_id: "link-2",
            title: "Commence Transfer",
            href: "/transfer",
            label: "System Override",
            variant: "link",
            target: "_self",
        },
        cover_image: {
            ...mockCoverImage,
            url: "",
            documentId: "doc-124",
            id: 124,
        },
    },
};
