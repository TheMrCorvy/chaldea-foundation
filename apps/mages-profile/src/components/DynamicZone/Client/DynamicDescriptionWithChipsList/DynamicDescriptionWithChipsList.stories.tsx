import type { Meta, StoryObj } from "@storybook/react";
import DynamicDescriptionWithChipsList from "./index";
import StarryContainer from "../../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicDescriptionWithChipsList",
    component: DynamicDescriptionWithChipsList,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <StarryContainer>
                <Story />
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicDescriptionWithChipsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        component_id: "desc-chips-1",
        __component: "dynamic-zone.description-with-chips-list",
        title: "Testing title of the component",
        color: "#eeeeee",
        font_size: "1.1rem",
        line_height: 1.8,
        id: 1,
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Welcome, Master. The Chaldea Security Organization is a secret agency founded to ensure the continuation of human history. We observe both the unseen and the seen worlds to guarantee the future of humanity.",
                    },
                ],
            },
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Key operational technologies currently online and stabilized:",
                        italic: true,
                        bold: true,
                    },
                ],
            },
        ],
        chips: [
            {
                id: 1,
                component_id: "chip-1",
                popover: "Global Environment Model",
                __component: "components.tool-chip",
                title: "CHALDEAS",
            },
            {
                id: 2,
                component_id: "chip-2",
                popover: "Spiritron Calculation Engine",
                __component: "components.tool-chip",
                title: "TRISMEGISTUS",
            },
            {
                component_id: "chip-3",
                popover: "Near-Future Observation Lens",
                __component: "components.tool-chip",
                title: "SHEBA",
                id: 3,
            },
            {
                component_id: "chip-4",
                popover: "Heroic Spirit Summoning System",
                __component: "components.tool-chip",
                title: "FATE",
                id: 4,
            },
            {
                component_id: "chip-5",
                popover: "Imaginary Number Observation Device",
                __component: "components.tool-chip",
                title: "PAPER MOON",
                id: 5,
            },
        ],
    },
};

export const PlainTextNoChips: Story = {
    args: {
        ...Default.args,
        component_id: "desc-chips-2",
        chips: [],
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Sensors report no specialized technologies available in this sector. Initiating standard observation protocols.",
                    },
                ],
            },
        ],
    },
};

export const WithIcons: Story = {
    args: {
        ...Default.args,
        component_id: "desc-chips-3",
        title: "Secure Protocols",
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "The following security and monitoring protocols are active in the facility. All Chaldea personnel are expected to be familiar with these directives.",
                    },
                ],
            },
        ],
        chips: [
            {
                component_id: "chip-icon-1",
                popover: "Main Facility Lock",
                __component: "components.tool-chip",
                title: "Lockdown",
                id: 1,
                icon: {
                    id: 1,
                    __component: "components.icon",
                    component_id: "icon-1",
                    title: "LockIcon",
                    name: "Lock",
                    color: "primary",
                    size: "small",
                },
            },
            {
                component_id: "chip-icon-2",
                popover: "Network Status",
                __component: "components.tool-chip",
                title: "Network Ops",
                id: 2,
                icon: {
                    id: 2,
                    __component: "components.icon",
                    component_id: "icon-2",
                    title: "WifiIcon",
                    name: "Wifi",
                    color: "success",
                    size: "small",
                },
            },
            {
                component_id: "chip-icon-3",
                popover: "Power Supply",
                __component: "components.tool-chip",
                title: "Generator",
                id: 3,
                icon: {
                    id: 3,
                    __component: "components.icon",
                    component_id: "icon-3",
                    title: "PowerIcon",
                    name: "Power",
                    color: "warning",
                    size: "small",
                },
            },
        ],
    },
};
