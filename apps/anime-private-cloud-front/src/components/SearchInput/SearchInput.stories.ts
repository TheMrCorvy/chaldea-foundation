import type { Meta, StoryObj } from "@storybook/react";
import SearchInput from ".";

const meta = {
    title: "Components/SearchInput",
    component: SearchInput,
    parameters: {
        layout: "centered",
        tags: ["autodocs"],
        argTypes: {
            backgroundColor: { control: "color" },
        },
    },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
