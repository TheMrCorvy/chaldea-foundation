import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import StarryContainer from "../../StarryContainer";
import RangeInput, { RangeInputProps, RangeInputValue } from "./index";

type RangeInputStoryProps = Omit<RangeInputProps, "value" | "onChange">;

const meta = {
    title: "Inputs/RangeInput",
    render: (args: RangeInputStoryProps) => <RangeInputWithState {...args} />,
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
} satisfies Meta<RangeInputStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// A wrapper component to handle the state of the input in Storybook
const RangeInputWithState = (args: RangeInputStoryProps) => {
    const [value, setValue] = useState<RangeInputValue>([
        args.min ?? 20,
        args.max ? args.max - 20 : 80,
    ]);

    return <RangeInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <RangeInputWithState {...args} />,
    args: {
        field: {
            name: "price_range",
            type: "range",
        } as RangeInputProps["field"],
        label: "Price Range",
        min: 0,
        max: 100,
        step: 1,
    },
};

export const Disabled: Story = {
    render: (args) => <RangeInputWithState {...args} />,
    args: {
        field: {
            name: "disabled_range",
            type: "range",
        } as RangeInputProps["field"],
        label: "Disabled Range",
        disabled: true,
        min: 0,
        max: 100,
        step: 5,
    },
};

export const CustomStep: Story = {
    render: (args) => <RangeInputWithState {...args} />,
    args: {
        field: {
            name: "temperature_range",
            type: "range",
        } as RangeInputProps["field"],
        label: "Temperature Range (°C)",
        min: -50,
        max: 50,
        step: 5,
    },
};
