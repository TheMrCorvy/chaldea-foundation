import type { Meta, StoryObj } from "@storybook/react";
import DynamicForm from "./index";
import StarryContainer from "../../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicForm",
    component: DynamicForm,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <StarryContainer>
                <Story />
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicForm>;

export default meta;

type Story = StoryObj<typeof DynamicForm>;

export const Default: Story = {
    args: {
        __component: "layout.form",
        component_id: "dynamic-form-123",
        title: "Communication Terminal",
        action: "/api/submit",
        method: "post",
        id: 1,
        inputs: [
            {
                __component: "layout.form-input",
                component_id: "input-name",
                name: "Agent Name",
                label: "Agent Name",
                type: "input",
                placeholder: "Enter identification",
                required: true,
                title: "Input Agent Name",
                id: 1,
            },
            {
                __component: "layout.form-input",
                component_id: "input-email",
                name: "Email Frequency",
                label: "Secure Frequency (Email)",
                type: "input",
                placeholder: "communication@chaldea.org",
                required: true,
                title: "Input Email Frequency",
                id: 1,
            },
            {
                __component: "layout.form-input",
                component_id: "input-message",
                name: "Message",
                label: "Transmission Body",
                type: "textarea",
                placeholder: "Enter report details...",
                required: true,
                title: "Input Message",
                id: 1,
            },
            {
                __component: "layout.form-input",
                component_id: "input-priority",
                name: "Priority",
                label: "Signal Priority",
                type: "select",
                id: 1,
                option: [
                    {
                        __component: "layout.select-option",
                        component_id: "opt-1",
                        title: "Low",
                        label: "Low (Class C)",
                        value: "low",
                        id: 1,
                    },
                    {
                        __component: "layout.select-option",
                        component_id: "opt-2",
                        title: "Normal",
                        label: "Normal (Class B)",
                        value: "normal",
                        id: 1,
                    },
                    {
                        __component: "layout.select-option",
                        component_id: "opt-3",
                        title: "High",
                        label: "High (Class A)",
                        value: "high",
                        id: 1,
                    },
                ],
                required: true,
                title: "Select Priority",
            },
            {
                __component: "layout.form-input",
                component_id: "input-submit",
                name: "Submit",
                label: "Initialize Transfer",
                type: "submit",
                title: "Submit Form",
                id: 1,
            },
        ],
    },
};
