import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StarryContainer from "./index";
import { Typography } from "@mui/material";

const meta = {
    title: "Components/StarryContainer",
    component: StarryContainer,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A container component that displays a starry background and centers its children.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text" },
    },
} satisfies Meta<typeof StarryContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <Typography sx={{ color: "white", zIndex: 1 }}>
                This is the content inside the starry container.
            </Typography>
        ),
    },
    render: (args) => <StarryContainer {...args} />,
};
