import type { Meta, StoryObj } from "@storybook/react";
import DirectoriesSidebar, { Props } from ".";
import { mockedDirectories } from "@/mocks/sidebarMocks";

const meta = {
    title: "Layout/DirectoriesSidebar",
    component: DirectoriesSidebar,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof DirectoriesSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        directories: mockedDirectories,
    },
};
