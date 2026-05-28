import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { LayoutLink } from "@repo/type-definitions/dynamic-page";
import DynamicLink from "./index";
import StarryContainer from "../../../StarryContainer";

type DynamicLinkProps = LayoutLink;

const baseIcon: LayoutLink["icon"] = {
    __component: "layout.icon",
    component_id: "icon-base",
    id: 0,
    title: null,
    name: "OpenInNew",
    size: "small",
    color: "inherit",
};

const meta = {
    title: "DynamicZone/DynamicLink",
    render: (args: DynamicLinkProps) => <DynamicLink {...args} />,
    parameters: {
        backgrounds: {
            default: "space",
            values: [
                { name: "space", value: "#010813" },
                { name: "chaldea-light", value: "#f0f4ff" },
            ],
        },
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <StarryContainer>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "20vh",
                        padding: "60px",
                        fontSize: "1rem",
                        color: "#eeeeee",
                    }}
                >
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<DynamicLinkProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinkVariant: Story = {
    args: {
        __component: "layout.link",
        component_id: "link-1",
        id: 1,
        title: null,
        href: "https://example.com",
        label: "Visit Chaldea",
        variant: "link",
        color: "primary",
        target: "_blank",
    },
};

export const LinkInheritColor: Story = {
    args: {
        ...LinkVariant.args,
        component_id: "link-2",
        id: 2,
        label: "Inherit color link",
        color: "inherit",
    },
};

export const IconLinkVariant: Story = {
    args: {
        __component: "layout.link",
        component_id: "link-3",
        id: 3,
        title: null,
        href: "https://github.com",
        label: "GitHub",
        variant: "icon_link",
        color: "info",
        target: "_blank",
        icon: {
            ...baseIcon,
            component_id: "icon-github",
            id: 1,
            name: "GitHub",
            size: "medium",
            color: "info",
        },
    },
};

export const LinkWithIconVariant: Story = {
    args: {
        __component: "layout.link",
        component_id: "link-4",
        id: 4,
        title: null,
        href: "https://example.com/docs",
        label: "Read the docs",
        variant: "link_with_icon",
        color: "primary",
        target: "_blank",
        icon: {
            ...baseIcon,
            component_id: "icon-docs",
            id: 2,
            name: "MenuBook",
            size: "small",
            color: "primary",
        },
    },
};

export const WithPopover: Story = {
    args: {
        ...LinkVariant.args,
        component_id: "link-5",
        id: 5,
        label: "Hover over me",
        popover: "Opens the Chaldea portal in a new tab",
    },
};

export const WithPopoverAndIcon: Story = {
    args: {
        ...LinkWithIconVariant.args,
        component_id: "link-6",
        id: 6,
        popover: "Full documentation available",
    },
};
