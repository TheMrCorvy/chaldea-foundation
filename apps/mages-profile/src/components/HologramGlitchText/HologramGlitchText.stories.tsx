import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HologramGlitchText, { GlitchTextProps } from "./index";
import StarryContainer from "../StarryContainer";

const meta = {
    title: "Components/HologramGlitchText",
    render: (args: GlitchTextProps) => <HologramGlitchText {...args} />,
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
} satisfies Meta<GlitchTextProps>;

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
        <StarryContainer>
            <HologramGlitchText {...args} />
        </StarryContainer>
    ),
};
