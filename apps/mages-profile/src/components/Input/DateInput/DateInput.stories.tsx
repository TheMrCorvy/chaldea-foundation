import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import StarryContainer from "../../StarryContainer";
import DateInput, { DateInputProps } from "./index";

type DateInputStoryProps = Omit<DateInputProps, "value" | "onChange">;

const meta = {
    title: "Inputs/DateInput",
    render: (args: DateInputStoryProps) => <DateInputWithState {...args} />,
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
} satisfies Meta<DateInputStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// A wrapper component to handle the state of the input in Storybook
const DateInputWithState = (args: DateInputStoryProps) => {
    const [value, setValue] = useState("");

    return <DateInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <DateInputWithState {...args} />,
    args: {
        field: {
            name: "birth_date",
            type: "date",
        } as DateInputProps["field"],
        label: "Date of Birth",
    },
};

export const WithHelperText: Story = {
    render: (args) => <DateInputWithState {...args} />,
    args: {
        field: {
            name: "appointment",
            type: "date",
        } as DateInputProps["field"],
        label: "Appointment Date",
        helper_text: "Please select a valid date in the future.",
    },
};

export const Disabled: Story = {
    render: (args) => <DateInputWithState {...args} />,
    args: {
        field: {
            name: "disabled_date",
            type: "date",
        } as DateInputProps["field"],
        label: "Registration Closed",
        disabled: true,
    },
};

export const Required: Story = {
    render: (args) => <DateInputWithState {...args} />,
    args: {
        field: {
            name: "expiration_date",
            type: "date",
        } as DateInputProps["field"],
        label: "Expiration Date",
        required: true,
    },
};
