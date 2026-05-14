import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import StarryContainer from "../../StarryContainer";
import SelectInput, { SelectInputProps } from "./index";

type SelectInputStoryProps = Omit<SelectInputProps, "value" | "onChange">;

const meta = {
    title: "Inputs/SelectInput",
    render: (args: SelectInputStoryProps) => <SelectInputWithState {...args} />,
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
} satisfies Meta<SelectInputStoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// A wrapper component to handle the state of the input in Storybook
const SelectInputWithState = (args: SelectInputStoryProps) => {
    const [value, setValue] = useState("");

    return <SelectInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
    render: (args) => <SelectInputWithState {...args} />,
    args: {
        field: {
            name: "class_selection",
            type: "select",
            option: [
                { component_id: "opt1", value: "saber", label: "Saber" },
                { component_id: "opt2", value: "archer", label: "Archer" },
                { component_id: "opt3", value: "lancer", label: "Lancer" },
            ],
        } as SelectInputProps["field"],
        label: "Servant Class",
        placeholder: "Select a class...",
    },
};

export const Disabled: Story = {
    render: (args) => <SelectInputWithState {...args} />,
    args: {
        field: {
            name: "disabled_select",
            type: "select",
            option: [
                {
                    component_id: "opt1",
                    value: "none",
                    label: "None Available",
                },
            ],
        } as SelectInputProps["field"],
        label: "Disabled Selection",
        disabled: true,
        placeholder: "Cannot select",
    },
};

export const WithIcons: Story = {
    render: (args) => <SelectInputWithState {...args} />,
    args: {
        field: {
            name: "icon_select",
            type: "select",
            option: [
                { component_id: "opt1", value: "val1", label: "Option 1" },
                { component_id: "opt2", value: "val2", label: "Option 2" },
            ],
        } as SelectInputProps["field"],
        label: "Select with Icons",
        placeholder: "Choose an option",
        start_icon: {
            name: "Search",
            color: "primary",
            __component: "shared.icon",
            component_id: "search_icon_1",
            id: 1,
            title: "Search Icon",
        },
        end_icon: {
            name: "ArrowDropDown",
            color: "inherit",
            __component: "shared.icon",
            id: 1,
            component_id: "dropdown_icon_1",
            title: "Dropdown Icon",
        },
    },
};
