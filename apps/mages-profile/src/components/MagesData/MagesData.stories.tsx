import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MagesData, { MagesDataProps } from "./index";
import StarryContainer from "../StarryContainer";

const meta = {
    title: "Components/MagesData",
    render: (args: MagesDataProps) => <MagesData {...args} />,
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
} satisfies Meta<MagesDataProps>;

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
        <StarryContainer>
            <MagesData {...args} />
        </StarryContainer>
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
        <StarryContainer>
            <MagesData {...args} />
        </StarryContainer>
    ),
};
