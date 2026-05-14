import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Modal, { ModalProps } from "./index";
import { Box } from "@mui/material";
import StarryContainer from "../StarryContainer";

const meta = {
    title: "Components/Modal",
    render: (args: ModalProps) => <Modal {...args} />,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#000000" }],
        },
        docs: {
            description: {
                component:
                    "A modal component that displays content in a stylized grid.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        open: { control: "boolean" },
        isMobile: { control: "boolean" },
        onExit: { action: "exited" },
    },
} satisfies Meta<ModalProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        open: true,
        isMobile: false,
        children: <Box sx={{ color: "white" }}>Modal Content</Box>,
        onExit: () => console.log("exit"),
    },
    render: (args) => (
        <StarryContainer>
            <Modal {...args} />
        </StarryContainer>
    ),
};

export const Mobile: Story = {
    args: {
        open: true,
        isMobile: true,
        children: <Box sx={{ color: "white" }}>Modal Content (Mobile)</Box>,
        onExit: () => console.log("exit"),
    },
    render: (args) => (
        <StarryContainer>
            <Modal {...args} />
        </StarryContainer>
    ),
};
