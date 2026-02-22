import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GlitchText from "./index";
import { Box } from "@mui/material";

const meta = {
    title: "Components/GlitchText",
    component: GlitchText,
    parameters: {
        layout: "centered",
        docs: {
            description: {
                component:
                    "A text component that applies a glitch effect to the text, revealing it character by character.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        text: { control: "text" },
        useMayus: { control: "boolean" },
        useNumbers: { control: "boolean" },
        useMinus: { control: "boolean" },
        useSymbols: { control: "boolean" },
        delay: { control: "number" },
        disableHover: { control: "boolean" },
        color: { control: "color" },
    },
} satisfies Meta<typeof GlitchText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "Hello, World!",
        useMayus: true,
        useNumbers: true,
        useMinus: true,
        useSymbols: false,
        delay: 0,
        disableHover: true,
        color: "white",
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
            <GlitchText {...args} />
        </Box>
    ),
};

export const HoverEffect: Story = {
    args: {
        ...Default.args,
        text: "Hover over me!",
        disableHover: false,
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
            <GlitchText {...args} />
        </Box>
    ),
};

export const WithDelay: Story = {
    args: {
        ...Default.args,
        text: "This will start after a delay.",
        delay: 2,
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
            <GlitchText {...args} />
        </Box>
    ),
};

export const WithAllCharacters: Story = {
    args: {
        ...Default.args,
        text: "Glitched with all characters!",
        useSymbols: true,
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
            <GlitchText {...args} />
        </Box>
    ),
};
