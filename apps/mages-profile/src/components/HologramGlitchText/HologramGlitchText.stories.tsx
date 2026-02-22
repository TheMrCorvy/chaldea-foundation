import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HologramGlitchText from "./index";
import { Box } from "@mui/material";

const meta = {
    title: "Components/HologramGlitchText",
    component: HologramGlitchText,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A text component that applies a hologram-style glitch effect using CSS.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        children: { control: "text" },
        color: { control: "color" },
    },
} satisfies Meta<typeof HologramGlitchText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Hologram Glitch",
        color: "#ffffff",
        fontSize: "3rem",
        fontWeight: "bold",
    },
    render: (args) => (
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
            <HologramGlitchText {...args} />
        </Box>
    ),
};
