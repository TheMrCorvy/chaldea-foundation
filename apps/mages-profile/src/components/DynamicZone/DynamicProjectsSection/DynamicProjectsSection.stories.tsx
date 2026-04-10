import type { Meta, StoryObj } from "@storybook/react";
import DynamicProjectsSection from "./index";
import StarryContainer from "../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicProjectsSection",
    component: DynamicProjectsSection,
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
                    }}
                >
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicProjectsSection>;

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
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
};

const mockCoverImage1 = {
    documentId: "doc-proj-1",
    id: 1,
    name: "project1.png",
    alternativeText: "Project 1 Cover",
    caption: null,
    width: 600,
    height: 400,
    formats: {
        thumbnail: mockFormat,
        small: mockFormat,
        medium: mockFormat,
        large: mockFormat,
    },
    mime: "image/png",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    publishedAt: new Date().toISOString(),
};

const mockCoverImage2 = {
    ...mockCoverImage1,
    id: 2,
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
};

export const Default: Story = {
    args: {
        __component: "layout.projects-section",
        component_id: "projects-section-1",
        title: "Singularity Archives",
        link_to_page: {
            __component: "layout.link",
            component_id: "link-view-all",
            title: "View All Projects",
            href: "/archives",
            label: "Explore Database",
            variant: "link",
            target: "_self",
        },
        projects: [
            {
                __component: "layout.project-list-item",
                component_id: "project-1",
                title: "Trismegistus Upgrade",
                highlighted_subtitle: "System Core Rewrite",
                popover: "High priority classified project",
                cover_image: mockCoverImage1,
                icon: {
                    __component: "layout.icon",
                    component_id: "icon-1",
                    title: "System Icon",
                    name: "Memory",
                    color: "primary",
                },
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-1",
                    title: "Tech Stack",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Complete overhaul of the prophetic calculating engine.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                    chips: [
                        {
                            __component: "layout.tool-chip",
                            component_id: "chip-1",
                            title: "React",
                            popover: "Frontend",
                        },
                        {
                            __component: "layout.tool-chip",
                            component_id: "chip-2",
                            title: "Node",
                            popover: "Backend",
                        },
                    ],
                },
                links: [
                    {
                        __component: "layout.link",
                        component_id: "project-link-1",
                        title: "Source Code",
                        href: "#",
                        label: "GitHub",
                        variant: "link",
                    },
                ],
            },
            {
                __component: "layout.project-list-item",
                component_id: "project-2",
                title: "Chaldeas Surveillance",
                highlighted_subtitle: "Global Monitoring",
                cover_image: mockCoverImage2,
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-2",
                    title: "Monitoring Stack",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Global surveillance tool to detect spacetime anomalies.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                    chips: [
                        {
                            __component: "layout.tool-chip",
                            component_id: "chip-3",
                            title: "GraphQL",
                            popover: "API",
                        },
                        {
                            __component: "layout.tool-chip",
                            component_id: "chip-4",
                            title: "TypeScript",
                            popover: "Superset",
                        },
                    ],
                },
                links: [],
            },
        ],
    },
};

export const WithoutImagesAndDisabledCard: Story = {
    args: {
        __component: "layout.projects-section",
        component_id: "projects-section-2",
        title: "Corrupted Projects Log",
        projects: [
            {
                __component: "layout.project-list-item",
                component_id: "project-3",
                title: "Project F",
                highlighted_subtitle: "Data Corrupt",
                disable_primary_link: true, // Simulating disabled card visually
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-3",
                    title: "Error Log",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Data unavailable. Contact system administrator.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                },
                links: [],
            },
            {
                __component: "layout.project-list-item",
                component_id: "project-4",
                title: "Analog Backup",
                highlighted_subtitle: "Offline Archive",
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-4",
                    title: "Details",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Physical media storage. Image missing.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                },
                links: [],
            },
            {
                __component: "layout.project-list-item",
                component_id: "project-3",
                title: "Project F",
                highlighted_subtitle: "Data Corrupt",
                disable_primary_link: true, // Simulating disabled card visually
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-3",
                    title: "Error Log",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Data unavailable. Contact system administrator.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                },
                links: [],
            },
            {
                __component: "layout.project-list-item",
                component_id: "project-4",
                title: "Analog Backup",
                highlighted_subtitle: "Offline Archive",
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-4",
                    title: "Details",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Physical media storage. Image missing.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                },
                links: [],
            },
            {
                __component: "layout.project-list-item",
                component_id: "project-3",
                title: "Project F",
                highlighted_subtitle: "Data Corrupt",
                disable_primary_link: true, // Simulating disabled card visually
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-3",
                    title: "Error Log",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Data unavailable. Contact system administrator.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                },
                links: [],
            },
            {
                __component: "layout.project-list-item",
                component_id: "project-4",
                title: "Analog Backup",
                highlighted_subtitle: "Offline Archive",
                body: {
                    __component: "layout.description-with-chips-list",
                    component_id: "desc-4",
                    title: "Details",
                    body: [
                        {
                            type: "paragraph",
                            children: [
                                {
                                    type: "text",
                                    text: "Physical media storage. Image missing.",
                                },
                            ],
                        },
                    ],
                    font_size: null,
                    line_height: null,
                    color: null,
                },
                links: [],
            },
        ],
    },
};
