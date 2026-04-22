import type { Meta, StoryObj } from "@storybook/react";
import DynamicLandingHeroSection from "./index";
import StarryContainer from "../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicLandingHeroSection",
    component: DynamicLandingHeroSection,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <StarryContainer>
                <Story />
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicLandingHeroSection>;

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
    url: "/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
};

const mockProfileImage = {
    documentId: "doc-profile",
    id: 1,
    name: "profile.png",
    alternativeText: "Agent Profile",
    caption: null,
    width: 500,
    height: 500,
    formats: {
        thumbnail: mockFormat,
        small: mockFormat,
        medium: mockFormat,
        large: mockFormat,
    },
    mime: "image/png",
    url: "/photo-1549490349-8643362247b5?q=80&w=500&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
};

const mockCommandsImage = {
    documentId: "doc-commands",
    id: 2,
    name: "commands.png",
    alternativeText: "Holographic Commands",
    caption: null,
    width: 1000,
    height: 1000,
    formats: {
        thumbnail: mockFormat,
        small: mockFormat,
        medium: mockFormat,
        large: mockFormat,
    },
    mime: "image/png",
    url: "/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
};

export const Default: Story = {
    args: {
        __component: "layout.landing-hero",
        component_id: "landing-hero-1",
        id: 1,
        title: "Master Director",
        highlighted_subtitle: "Access Granted. Welcome back to Chaldea.",
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "All vital signs read normal. The ",
                    },
                    {
                        type: "text",
                        text: "Grand Order",
                        bold: true,
                    },
                    {
                        type: "text",
                        text: " simulation is up and running. Awaiting further commands to restore the humanity foundation.",
                    },
                ],
            },
        ],
        helper_text: "System status: Online. Syncing with Trismegistus.",
        profile_image: mockProfileImage,
        commands: mockCommandsImage,
        call_to_actions: [
            {
                popover: "Commence briefing",

                __component: "layout.link",
                component_id: "link-1",
                href: "/brief",
                label: "Review Briefing",
                variant: "link",
                target: "_self",
                title: "Access Briefing",
                id: 1,
            },
        ],
        pdf_file: {
            __component: "layout.pdf-component",
            component_id: "pdf-1",
            title: "Download Status Report",
            popover: "Classified Mission Report",
            file: {},
            id: 1,
        },
        imageBaseUrl: "https://images.unsplash.com",
    },
};

export const NoData: Story = {
    args: {
        __component: "layout.landing-hero",
        component_id: "landing-hero-2",
        id: 2,
        title: "Unknown Observer",
        highlighted_subtitle: "Error: No ID detected.",
        body: [],
        helper_text: "Restricted Access. Please insert ID card.",
        profile_image: {
            ...mockProfileImage,
            url: "",
        },
        commands: {
            ...mockCommandsImage,
            url: "",
        },
        imageBaseUrl: "https://images.unsplash.com",
    },
};
