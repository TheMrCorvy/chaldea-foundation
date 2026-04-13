import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import StarryContainer from "../../StarryContainer";
import TextInput, { TextInputProps } from "./index";

const meta: Meta<typeof TextInput> = {
    title: "Inputs/TextInput",
    component: TextInput,
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
type Story = StoryObj<typeof TextInput>;

const TextInputWithState = (
    args: Omit<TextInputProps, "value" | "onChange">
) => {
    const [value, setValue] = useState("");

    return <TextInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <TextInputWithState {...args} />,
    args: {
        field: {
            name: "username",
            type: "input",
            label: "Username",
        } as TextInputProps["field"],
        label: "Username",
        placeholder: "Enter your username",
    },
};

export const WithHelperText: Story = {
    render: (args) => <TextInputWithState {...args} />,
    args: {
        field: {
            name: "email",
            type: "input",
        } as TextInputProps["field"],
        label: "Email Address",
        placeholder: "name@example.com",
        helper_text: "We'll never share your email with anyone else.",
    },
};

export const Disabled: Story = {
    render: (args) => <TextInputWithState {...args} />,
    args: {
        field: {
            name: "disabled_input",
            type: "input",
        } as TextInputProps["field"],
        label: "Disabled Input",
        disabled: true,
        placeholder: "This input is disabled",
    },
};

export const WithIcons: Story = {
    render: (args) => <TextInputWithState {...args} />,
    args: {
        field: {
            name: "search",
            type: "input",
        } as TextInputProps["field"],
        label: "Search",
        placeholder: "Search for items...",
        start_icon: {
            name: "Search",
            color: "primary",
            __component: "shared.icon",
            component_id: "search_icon_1",
            title: "Search Icon",
        },
        end_icon: {
            name: "Close",
            color: "error",
            __component: "shared.icon",
            component_id: "close_icon_1",
            title: "Close Icon",
        },
    },
};
