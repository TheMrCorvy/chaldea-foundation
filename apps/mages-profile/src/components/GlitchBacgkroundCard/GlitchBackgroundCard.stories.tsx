import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GlitchBackgroundCard from "./index";
import { Box } from "@mui/material";
import StarryContainer from "../StarryContainer";

const meta = {
    title: "Components/GlitchBackgroundCard",
    component: GlitchBackgroundCard,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#000000" }],
        },
        docs: {
            description: {
                component: "A card component with a glitch background effect.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        isMobile: { control: "boolean" },
    },
} satisfies Meta<typeof GlitchBackgroundCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isMobile: false,
        children: <Box sx={{ color: "white" }}>Hover over me</Box>,
    },
    render: (args) => (
        <StarryContainer>
            <GlitchBackgroundCard {...args} />
        </StarryContainer>
    ),
};

export const Mobile: Story = {
    args: {
        isMobile: true,
        children: <Box sx={{ color: "white" }}>Mobile view</Box>,
    },
    render: (args) => (
        <StarryContainer>
            <GlitchBackgroundCard {...args} />
        </StarryContainer>
    ),
};
