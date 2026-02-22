import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Loader from "./index";
import { Box } from "@mui/material";

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
        <Box
            sx={{
                height: "100dvh",
                width: "100dvw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#000000",
            }}
        >
            <Loader {...args} />
        </Box>
    ),
};
