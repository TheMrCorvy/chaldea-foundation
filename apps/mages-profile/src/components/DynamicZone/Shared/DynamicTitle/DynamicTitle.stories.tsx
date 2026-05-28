import type { Meta, StoryObj } from "@storybook/react";
import DynamicTitle, { DynamicTitleProps } from "./index";
import StarryContainer from "../../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicTitle",
    render: (args: DynamicTitleProps) => <DynamicTitle {...args} />,
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
                <div
                    style={{
                        padding: "60px",
                        maxWidth: "900px",
                        margin: "0 auto",
                    }}
                >
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<DynamicTitleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        id: 1,
        title: "Fate/Grand Order",
        size: "h3",
        color: "#eeeeee",
        text_align: "center",
        cycles: 2,
    },
};

export const LeftAligned: Story = {
    args: {
        id: 2,
        title: "Singularity Detected",
        size: "h4",
        color: "#eeeeee",
        text_align: "left",
        cycles: 2,
    },
};

export const RightAligned: Story = {
    args: {
        id: 3,
        title: "Chaldea Log Entry",
        size: "h4",
        color: "#eeeeee",
        text_align: "right",
        popover: "Jump to this section",
        cycles: 2,
    },
};

export const H1Large: Story = {
    args: {
        id: 4,
        title: "Master Protocol",
        size: "h1",
        color: "#38b6ff",
        text_align: "center",
        cycles: 3,
    },
};

export const WithLink: Story = {
    args: {
        id: 5,
        title: "Project Lazarus",
        size: "h2",
        color: "#eeeeee",
        text_align: "left",
        cycles: 2,
        link_to_page: {
            id: 0,
            __component: "layout.link",
            component_id: "link-5",
            title: "View Project",
            href: "/projects/lazarus",
            label: "Explore Mission",
            variant: "link",
            target: "_self",
        },
    },
};

export const WithLinkIconColor: Story = {
    args: {
        id: 6,
        title: "Spirit Origin Status",
        size: "h3",
        color: "#eeeeee",
        text_align: "center",
        link_icon_color: "success",
        popover: "Copy link to this section",
        cycles: 2,
    },
};

export const WithCustomPopover: Story = {
    args: {
        id: 7,
        title: "Rayshift Authorization",
        size: "h3",
        color: "#ffd700",
        text_align: "center",
        popover: "Copy Rayshift coordinates",
        cycles: 4,
    },
};
