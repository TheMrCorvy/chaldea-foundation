import type { Meta, StoryObj } from "@storybook/react";
import TopNavigation from ".";
import { navbarItems } from "@/mocks/topNavigationItems";

const meta = {
    title: "Layout/TopNavigation",
    component: TopNavigation,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof TopNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        navbarSections: navbarItems,
        className: "h-16 bg-slate-800 text-white",
        position: "static",
    },
};
