import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PixelCard from "./index";
import { Box } from "@mui/material";

const meta = {
    title: "Components/PixelCard",
    component: PixelCard,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#000000" }],
        },
        docs: {
            description: {
                component:
                    "A card component with a pixelated background effect.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "blue", "yellow", "pink"],
        },
        gap: { control: "number" },
        speed: { control: "number" },
        colors: { control: "text" },
        noFocus: { control: "boolean" },
        focusOnMount: { control: "boolean" },
        width: { control: "text" },
        height: { control: "text" },
        roundedBorders: { control: "boolean" },
    },
} satisfies Meta<typeof PixelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: "default",
        children: (
            <Box sx={{ color: "white", padding: 2, bg: "red" }}>
                Pixel Card (Hover or Focus test)
            </Box>
        ),
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
            <Box sx={{ width: 300, height: 300, position: "relative" }}>
                <PixelCard {...args} />
            </Box>
        </Box>
    ),
};

export const FocusOnMount: Story = {
    args: {
        variant: "default",
        focusOnMount: true,
        children: (
            <Box sx={{ color: "white", padding: 2, bg: "red" }}>
                Pixel Card (Hover or Focus test)
            </Box>
        ),
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
            <Box sx={{ width: 300, height: 300, position: "relative" }}>
                <PixelCard {...args} />
            </Box>
        </Box>
    ),
};

export const NoRoundedBorders: Story = {
    args: {
        variant: "default",
        roundedBorders: false,
        children: (
            <Box sx={{ color: "white", padding: 2, bg: "red" }}>
                Pixel Card (Hover or Focus test)
            </Box>
        ),
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
            <Box sx={{ width: 300, height: 300, position: "relative" }}>
                <PixelCard {...args} />
            </Box>
        </Box>
    ),
};

export const Blue: Story = {
    args: {
        variant: "blue",
        children: <Box sx={{ color: "white", padding: 2 }}>Focus me</Box>,
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
            <Box sx={{ width: 300, height: 300, position: "relative" }}>
                <PixelCard {...args} />
            </Box>
        </Box>
    ),
};

export const Yellow: Story = {
    args: {
        variant: "yellow",
        children: <Box sx={{ color: "white", padding: 2 }}>Hover over me</Box>,
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
            <Box sx={{ width: 300, height: 300, position: "relative" }}>
                <PixelCard {...args} />
            </Box>
        </Box>
    ),
};

export const Pink: Story = {
    args: {
        variant: "pink",
        children: <Box sx={{ color: "white", padding: 2 }}>Always on</Box>,
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
            <Box sx={{ width: 300, height: 300, position: "relative" }}>
                <PixelCard {...args} />
            </Box>
        </Box>
    ),
};
