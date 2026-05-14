import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import ExperienceListItem, { ExperienceListItemProps } from "./index";
import StarryContainer from "../StarryContainer";

const meta = {
    title: "Components/ExperienceListItem",
    render: (args: ExperienceListItemProps) => <ExperienceListItem {...args} />,
    parameters: {
        layout: "centered",
        docs: {
            description:
                "A component that displays information about working history of the user.",
        },
    },
    tags: ["autodocs"],
    argTypes: {
        experience: { control: "object" },
    },
} satisfies Meta<ExperienceListItemProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockExperience: LayoutWorkExperienceListItem = {
    __component: "layout.work-experience-list-item",
    component_id: "id",
    title: "Senior Software Engineer",
    orientation: "Full-stack",
    company: "FutureTech Solutions",
    id: 1,
    client: "Global Innovations Corp",
    from: new Date("2021-08-01"),
    until: new Date("2023-12-31"),
    location: "Neo-Tokyo, JP",
    color: "#eeeeee",
    font_size: "1rem",
    line_height: 1.5,
    text_align: "left",
    highlighted_text_color: "inherit",
    body: [
        {
            type: "paragraph",
            children: [
                {
                    type: "text",
                    text: "Led the development of a next-generation decentralized application platform using bleeding-edge technologies like ",
                },
                { type: "text", text: "React", bold: true },
                { type: "text", text: ", " },
                { type: "text", text: "Rust", bold: true },
                { type: "text", text: ", and " },
                { type: "text", text: "Solana", bold: true },
                { type: "text", text: "." },
            ],
        },
        {
            type: "paragraph",
            children: [
                {
                    type: "text",
                    text: "Engineered high-performance smart contracts and optimized frontend rendering for a seamless user experience.",
                },
            ],
        },
    ],
};

export const Default: Story = {
    args: {
        experience: mockExperience,
    },
    render: (args) => (
        <StarryContainer>
            <ExperienceListItem {...args} />
        </StarryContainer>
    ),
};

export const WithoutOptionalFields: Story = {
    args: {
        experience: {
            ...mockExperience,
            client: undefined,
            orientation: undefined,
        },
    },
    render: (args) => (
        <StarryContainer>
            <ExperienceListItem {...args} />
        </StarryContainer>
    ),
};

export const DifferentRole: Story = {
    args: {
        experience: {
            ...mockExperience,
            __component: "layout.work-experience-list-item",
            component_id: "id",
            title: "Senior Software Engineer",
            orientation: "Full-stack",
            company: "FutureTech Solutions",
            client: "Global Innovations Corp",
            from: new Date("2021-08-01"),
            until: new Date("2023-12-31"),
            location: "Neo-Tokyo, JP",
            color: "#eeeeee",
            font_size: "1rem",
            line_height: 1.5,
            text_align: "left",
            highlighted_text_color: "inherit",
            body: [
                {
                    type: "paragraph",
                    children: [
                        {
                            type: "text",
                            text: "Designed and implemented the core architecture for a global AI network. Focused on scalability, security, and resilience.",
                        },
                    ],
                },
            ],
        },
    },
    render: (args) => (
        <StarryContainer>
            <ExperienceListItem {...args} />
        </StarryContainer>
    ),
};
