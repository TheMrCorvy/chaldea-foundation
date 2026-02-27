import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Loader from "./index";
import StarryContainer from "../StarryContainer";

const meta = {
    title: "Components/Loader",
    component: Loader,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <StarryContainer>
            <Loader {...args} />
        </StarryContainer>
    ),
};
