import type { Meta, StoryObj } from "@storybook/react";
import DynamicBlogImage, { DynamicBlogImageProps } from "./index";
import StarryContainer from "../../../StarryContainer";
import { BlogImageComponent } from "@repo/type-definitions/dynamic-page";

const meta = {
    title: "DynamicZone/DynamicBlogImage",
    render: (args: BlogImageComponent) => (
        <DynamicBlogImage
            {...args}
            imageBaseUrl="https://images.unsplash.com"
        />
    ),
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <StarryContainer>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                    }}
                >
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<BlogImageComponent>;

export default meta;
type Story = StoryObj<DynamicBlogImageProps>;

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
    url: "/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
};

const mockImage = {
    documentId: "blog-img-123",
    id: 123,
    alternativeText: "Circuit board macro",
    caption: null,
    formats: {
        thumbnail: mockFormat,
        small: mockFormat,
        medium: mockFormat,
        large: mockFormat,
    },
    name: "circuit.png",
    hash: "circuit_hash",
    ext: ".png",
    mime: "image/png",
    width: 800,
    height: 500,
    size: 2048,
    sizeInBytes: 2048000,
    url: "/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
};

export const Default: Story = {
    args: {
        id: 1,
        __component: "layout.blog-image-component",
        component_id: "blog-img-1",
        title: "Trismegistus Core Processing",
        alt: "Trismegistus logic matrix visualization",
        width: 800,
        height: 500,
        body: "Visual representation of the central calculating engine analyzing the current timeline.",
        image: mockImage,
        imageBaseUrl: "https://images.unsplash.com",
    },
};

export const CustomAspectRatio: Story = {
    args: {
        id: 2,
        __component: "layout.blog-image-component",
        component_id: "blog-img-2",
        title: "Subject Monitoring Feed",
        alt: "Square monitor feed tracking",
        width: 500, // Forces a 1:1 aspect ratio when height is also 500
        height: 500,
        body: "Live feed tracking bio-signs from the field agent. Minimal latency detected.",
        image: mockImage,
        imageBaseUrl: "https://images.unsplash.com",
    },
};

export const FallbackNoImage: Story = {
    args: {
        id: 3,
        __component: "layout.blog-image-component",
        component_id: "blog-img-3",
        title: "Corrupted Data Stream",
        alt: "No visual data available",
        width: 600,
        height: 350,
        body: "Signal lost. Attempting to reconnect to Novum Chaldea...",
        image: {
            ...mockImage,
            url: "",
        },
        imageBaseUrl: "https://images.unsplash.com",
    },
};
