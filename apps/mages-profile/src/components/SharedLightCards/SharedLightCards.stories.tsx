import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SharedLightCards from "./index";
import { Box } from "@mui/material";

const meta = {
    title: "Components/SharedLightCards",
    component: SharedLightCards,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A set of cards with a shared light effect that follows the mouse cursor.",
            },
        },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof SharedLightCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Box
            sx={{
                width: "100dvw",
                height: "100dvh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
            }}
        >
            <SharedLightCards />
        </Box>
    ),
};
