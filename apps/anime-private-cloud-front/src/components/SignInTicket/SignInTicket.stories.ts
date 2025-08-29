import type { Meta, StoryObj } from "@storybook/react";
import SignInTicket from ".";
import { registerTokens } from "@/mocks/mockedResponses";
import { RegisterToken } from "@/types/StrapiSDK";

const meta = {
    title: "Components/SignInTicket",
    component: SignInTicket,
    parameters: {
        layout: "fullscreen",
        argTypes: {
            backgroundColor: {
                control: "color",
            },
        },
        tags: ["autodocs"],
    },
} satisfies Meta<typeof SignInTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoginVersion: Story = {
    args: {},
};

const token = registerTokens["1"].data as RegisterToken[];

export const RegisterVersion: Story = {
    args: {
        isRegisterForm: true,
        registerToken: token[0] as RegisterToken,
    },
};
