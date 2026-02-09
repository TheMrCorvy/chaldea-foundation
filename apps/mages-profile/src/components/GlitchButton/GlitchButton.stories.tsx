import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GlitchButton from "./index";

const meta = {
    title: "Components/GlitchButton",
    component: GlitchButton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text" },
        onClick: { action: "clicked" },
        cornerVariant: {
            control: { type: "radio" },
            options: ["right", "left"],
        },
        active: { control: "boolean" },
    },
} satisfies Meta<typeof GlitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: "Default Button",
        cornerVariant: "right",
        active: false,
    },
};

export const LeftCorner: Story = {
    args: {
        label: "Left Corner",
        cornerVariant: "left",
        active: false,
    },
};

export const Active: Story = {
    args: {
        label: "Active Button",
        cornerVariant: "right",
        active: true,
    },
};
