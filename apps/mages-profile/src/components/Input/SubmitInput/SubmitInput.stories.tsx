import type { Meta, StoryObj } from "@storybook/react";
import StarryContainer from "../../StarryContainer";
import SubmitInput, { SubmitInputProps } from "./index";

const meta: Meta<typeof SubmitInput> = {
    title: "Inputs/SubmitInput",
    component: SubmitInput,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <StarryContainer>
                <div style={{ width: "300px" }}>
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SubmitInput>;

export const Default: Story = {
    args: {
        field: {
            name: "submit_action",
            type: "submit",
        } as SubmitInputProps["field"],
        label: "Primary Action",
        value: "Submit Data",
        onChange: (value) => console.log("Submit clicked with value:", value),
    },
};

export const Disabled: Story = {
    args: {
        field: {
            name: "submit_disabled",
            type: "submit",
        } as SubmitInputProps["field"],
        label: "Disabled Action",
        value: "Processing...",
        disabled: true,
        onChange: (value) => console.log("Submit clicked with value:", value),
    },
};

export const LargeSize: Story = {
    args: {
        field: {
            name: "submit_large",
            type: "submit",
        } as SubmitInputProps["field"],
        label: "Large Button",
        value: "Launch",
        size: "medium",
        onChange: (value) => console.log("Submit clicked with value:", value),
    },
};
