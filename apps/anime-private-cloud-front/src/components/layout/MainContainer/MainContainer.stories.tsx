import type { Meta, StoryObj } from "@storybook/react";
import MainContainer, { Props } from ".";
import MockedContent from "@/mocks/contentForContainer";

const meta = {
    title: "Layout/MainContainer",
    component: MainContainer,
    parameters: {
        layout: "fullscreen",
        argTypes: {
            backgroundColor: {
                control: "color",
            },
        },
        tags: ["autodocs"],
    },
} satisfies Meta<typeof MainContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <section className="felx flex-col w-full gap-6 h-auto">
                <MockedContent amountOfItems={120} />
            </section>
        ),
    },
};
