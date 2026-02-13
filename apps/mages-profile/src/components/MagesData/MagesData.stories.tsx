import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Box } from "@mui/material";
import MagesData from "./index";

const meta = {
    title: "Components/MagesData",
    component: MagesData,
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#000000" }],
        },
    },
    tags: ["autodocs"],
    argTypes: {
        isMobile: { control: "boolean" },
    },
} satisfies Meta<typeof MagesData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: "Gonzalo Salvador Corvalan",
        position: "Fullstack developer",
        commands: "Path to commands image",
        profile_image: "Path to profile image",
        isMobile: false,
    },
    render: (args) => (
        <Box
            sx={{
                position: "relative",
                width: "100dvw",
                height: "100dvh",
                backgroundColor: "#000000",
            }}
        >
            <MagesData {...args} />
        </Box>
    ),
};

export const Mobile: Story = {
    args: {
        name: "Gonzalo Salvador Corvalan",
        position: "Fullstack developer",
        commands: "Path to commands image",
        profile_image: "Path to profile image",
        isMobile: true,
    },
    render: (args) => (
        <Box
            sx={{
                position: "relative",
                width: "100dvw",
                height: "100dvh",
                backgroundColor: "#000000",
            }}
        >
            <MagesData {...args} />
        </Box>
    ),
};
