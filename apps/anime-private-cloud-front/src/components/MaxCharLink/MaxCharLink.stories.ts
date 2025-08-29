import type { Meta, StoryObj } from "@storybook/react";
import MaxCharLink, { Props } from ".";

const meta = {
    title: "Components/MaxCharLink",
    component: MaxCharLink,
    parameters: {
        layout: "centered",
        tags: ["autodocs"],
        argTypes: {
            backgroundColor: { control: "color" },
        },
    },
} satisfies Meta<typeof MaxCharLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        url: "https://google.com",
        label: "link full text",
    },
};

export const Truncated: Story = {
    args: {
        url: "https://google.com",
        label: "link full text, but is too long to fit",
        popoverPlacement: "right",
    },
};

export const PopoverPosition: Story = {
    args: {
        url: "https://google.com",
        label: "link full text, but is too long to fit",
        popoverPlacement: "bottom",
    },
};
