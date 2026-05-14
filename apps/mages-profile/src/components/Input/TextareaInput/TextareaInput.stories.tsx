import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import StarryContainer from "../../StarryContainer";
import TextareaInput, { TextareaInputProps } from "./index";

type TextareaInputStoryProps = Omit<TextareaInputProps, "value" | "onChange">;

const meta = {
    title: "Inputs/TextAreaInput",
    render: (args: TextareaInputStoryProps) => (
        <TextareaInputWithState {...args} />
    ),
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <StarryContainer>
                <div style={{ width: "400px" }}>
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<TextareaInputStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// A wrapper component to handle the state of the input in Storybook
const TextareaInputWithState = (args: TextareaInputStoryProps) => {
    const [value, setValue] = useState("");

    return <TextareaInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <TextareaInputWithState {...args} />,
    args: {
        field: {
            name: "description",
            type: "textarea",
            label: "Description",
        } as TextareaInputProps["field"],
        label: "Description",
        placeholder: "Enter a detailed description...",
        rows: 4,
    },
};

export const WithHelperText: Story = {
    render: (args) => <TextareaInputWithState {...args} />,
    args: {
        field: {
            name: "notes",
            type: "textarea",
        } as TextareaInputProps["field"],
        label: "Notes",
        placeholder: "Additional notes go here...",
        helper_text: "Please provide any extra information here.",
        rows: 3,
    },
};

export const Disabled: Story = {
    render: (args) => <TextareaInputWithState {...args} />,
    args: {
        field: {
            name: "disabled_textarea",
            type: "textarea",
        } as TextareaInputProps["field"],
        label: "Disabled Field",
        disabled: true,
        placeholder: "This field is not editable.",
        rows: 5,
    },
};
