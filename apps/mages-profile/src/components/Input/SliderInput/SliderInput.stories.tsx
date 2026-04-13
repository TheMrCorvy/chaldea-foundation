import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import StarryContainer from "../../StarryContainer";
import SliderInput, { SliderInputProps } from "./index";

const meta: Meta<typeof SliderInput> = {
    title: "Inputs/SliderInput",
    component: SliderInput,
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
type Story = StoryObj<typeof SliderInput>;

// A wrapper component to handle the state of the input in Storybook
const SliderInputWithState = (
    args: Omit<SliderInputProps, "value" | "onChange">
) => {
    const [value, setValue] = useState<number>(args.min ?? 50);

    return <SliderInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <SliderInputWithState {...args} />,
    args: {
        field: {
            name: "volume",
            type: "slider",
        } as SliderInputProps["field"],
        label: "Volume Control",
        min: 0,
        max: 100,
        step: 1,
    },
};

export const Disabled: Story = {
    render: (args) => <SliderInputWithState {...args} />,
    args: {
        field: {
            name: "disabled_slider",
            type: "slider",
        } as SliderInputProps["field"],
        label: "Disabled Slider",
        disabled: true,
        min: 0,
        max: 100,
        step: 10,
    },
};

export const CustomRange: Story = {
    render: (args) => <SliderInputWithState {...args} />,
    args: {
        field: {
            name: "temperature",
            type: "slider",
        } as SliderInputProps["field"],
        label: "Temperature (°C)",
        min: -50,
        max: 50,
        step: 5,
    },
};
