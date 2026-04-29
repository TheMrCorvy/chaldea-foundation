import type { Meta, StoryObj } from "@storybook/react";
import DynamicBlogText from "./index";
import StarryContainer from "../../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicBlogText",
    component: DynamicBlogText,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <StarryContainer>
                <Story />
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicBlogText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        id: 1,
        component_id: "blog-text-1",
        __component: "dynamic-zone.blog-text",
        title: "Log Entry: Starlight",
        color: "#eeeeee",
        font_size: "1.1rem",
        line_height: 1.8,
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "The observation lens SHEBA has detected a minor fluctuation in the near-future timeline. It is recommended that we verify the integrity of the Spiritron Calculation Engine before proceeding with further Rayshifting experiments.",
                    },
                ],
            },
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "Warning: ",
                        bold: true,
                    },
                    {
                        type: "text",
                        text: "Temporal anomalies detected in Sector 4.",
                        italic: true,
                    },
                ],
            },
        ],
    },
};

export const NoTitle: Story = {
    args: {
        ...Default.args,
        component_id: "blog-text-2",
        title: null,
        body: [
            {
                type: "paragraph",
                children: [
                    {
                        type: "text",
                        text: "End of transmission. Awaiting further Master directives.",
                    },
                ],
            },
        ],
    },
};
