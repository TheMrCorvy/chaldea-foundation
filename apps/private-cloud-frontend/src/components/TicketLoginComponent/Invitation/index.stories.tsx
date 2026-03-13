import Box from "@mui/joy/Box";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Invitation from ".";

const meta = {
    title: "Components/TicketLoginComponent/Invitation",
    component: Invitation,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    px: 3,
                    py: 6,
                    background:
                        "radial-gradient(circle at 20% 10%, #1f2a44 0%, #0b1020 42%, #05070f 100%)",
                }}
            >
                <Box
                    sx={{
                        width: "min(960px, 100%)",
                        minHeight: "520px",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                    }}
                >
                    <Story />
                </Box>
            </Box>
        ),
    ],
    args: {
        isRegisterForm: false,
        ticketNumber: "TK-123",
        createdAt: new Date("2026-03-10T12:00:00.000Z"),
    },
} satisfies Meta<typeof Invitation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RegisterFormWithUser: Story = {
    args: {
        isRegisterForm: true,
        ticketNumber: 999,
        createdAt: new Date("2026-03-11T10:00:00.000Z"),
        userName: "Jeanne",
    },
};

export const WithoutCreatedAt: Story = {
    args: {
        isRegisterForm: false,
        ticketNumber: "TK-456",
        createdAt: undefined,
    },
};
