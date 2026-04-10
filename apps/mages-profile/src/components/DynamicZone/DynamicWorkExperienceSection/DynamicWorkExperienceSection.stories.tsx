import type { Meta, StoryObj } from "@storybook/react";
import DynamicWorkExperienceSection from "./index";
import StarryContainer from "../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicWorkExperienceSection",
    component: DynamicWorkExperienceSection,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <StarryContainer>
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicWorkExperienceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        __component: "layout.work-experience-section",
        component_id: "work-exp-1",
        title: "Service Record",
        link_to_page: {
            __component: "layout.link",
            component_id: "link-1",
            title: "Archived Deployments",
            href: "/service-record",
            label: "Open Full Record",
            variant: "link",
            target: "_self",
        },
        experience_list_items: [
            {
                __component: "layout.work-experience-list-item",
                component_id: "exp-1",
                title: "Master Candidate",
                company: "Chaldea Security Organization",
                client: "Humanity Preservation Project",
                location: "Antarctica, Earth",
                orientation: "General Director",
                from: new Date("2015-07-01"),
                until: new Date("2016-12-31"),
                popover: "Survivor of the initial sabotage.",
                body: [
                    {
                        type: "paragraph",
                        children: [
                            {
                                type: "text",
                                text: "Successfully completed the Grand Order to restore human history.",
                            },
                        ],
                    },
                ],
            },
            {
                __component: "layout.work-experience-list-item",
                component_id: "exp-2",
                title: "Crypter Resistance Leader",
                company: "Novum Chaldea",
                location: "Wandering Sea",
                orientation: "Field Commander",
                from: new Date("2017-01-01"),
                until: new Date(),
                popover: "Currently active on the Lostbelt operations.",
                body: [
                    {
                        type: "paragraph",
                        children: [
                            { type: "text", text: "Engaged in resolving " },
                            {
                                type: "text",
                                text: "Cosmos in the Lostbelt",
                                bold: true,
                            },
                            {
                                type: "text",
                                text: ". Commanding operations from the Shadow Border.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

export const WithoutLinkAndPopover: Story = {
    args: {
        __component: "layout.work-experience-section",
        component_id: "work-exp-2",
        title: "Classified History",
        experience_list_items: [
            {
                __component: "layout.work-experience-list-item",
                component_id: "exp-3",
                title: "Unknown Operator",
                company: "Atlas Institute",
                location: "Unknown",
                from: new Date("2010-01-01"),
                until: new Date("2014-01-01"),
                // Omitting client, orientation, and popover
                body: [
                    {
                        type: "paragraph",
                        children: [
                            {
                                type: "text",
                                text: "[REDACTED] data fragment retrieved from the Atlas archives.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
