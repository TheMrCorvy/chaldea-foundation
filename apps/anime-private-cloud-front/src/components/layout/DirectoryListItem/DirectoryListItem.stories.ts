import type { Meta, StoryObj } from "@storybook/react";
import DirectoryListItem from ".";

const meta = {
    title: "Layout/DirectoryListItem",
    component: DirectoryListItem,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof DirectoryListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        displayName: "Directory name",
        directoryId: "2",
    },
};

export const IsAdult: Story = {
    args: {
        displayName: "Directory name",
        directoryId: "2",
        isAdult: true,
    },
};
