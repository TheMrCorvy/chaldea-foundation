import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { BlogReadingProgressBar } from "@repo/type-definitions/dynamic-page";
import DynamicReadingProgressBar from "./index";
import StarryContainer from "../../../StarryContainer";

type DynamicReadingProgressBarProps = BlogReadingProgressBar;

const baseTitle: BlogReadingProgressBar["title"] = {
    __component: "layout.title",
    component_id: "title-bar",
    id: 0,
    title: null,
    color: "#eeeeee",
    size: "h3",
    text_align: "left",
    link_icon_color: "info",
    animation_cycles: 2,
};

const meta = {
    title: "DynamicZone/DynamicReadingProgressBar",
    render: (args: DynamicReadingProgressBarProps) => (
        <DynamicReadingProgressBar {...args} />
    ),
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "space",
            values: [
                { name: "space", value: "#010813" },
                { name: "chaldea-light", value: "#f0f4ff" },
            ],
        },
    },
    decorators: [
        (Story) => (
            <StarryContainer>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "40px 20px",
                        gap: "1.5rem",
                        color: "#eeeeee",
                    }}
                >
                    <p
                        style={{
                            opacity: 0.5,
                            fontSize: "0.85rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            position: "sticky",
                            top: "16px",
                            zIndex: 10,
                            background: "rgba(1, 8, 19, 0.7)",
                            padding: "6px 16px",
                            borderRadius: "4px",
                        }}
                    >
                        ↓ Scroll down to see the reading progress bar ↓
                    </p>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <p
                            key={i}
                            style={{
                                maxWidth: "680px",
                                lineHeight: 1.9,
                                opacity: 0.65,
                                textAlign: "justify",
                                margin: 0,
                            }}
                        >
                            {`Paragraph ${i + 1} — The observation lens SHEBA has detected a minor
                            fluctuation in the near-future timeline. Analysis of the resonance
                            pattern suggests an upcoming convergence event. All operators are
                            advised to maintain their current operational positions until
                            further notice from the Chaldea Foundation command center.`}
                        </p>
                    ))}
                </div>
                <Story />
            </StarryContainer>
        ),
    ],
} satisfies Meta<DynamicReadingProgressBarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopBar: Story = {
    args: {
        __component: "dynamic-zone.reading-progress-bar",
        component_id: "bar-top",
        id: 1,
        position: "top",
        reversed: false,
        color: "primary",
        bar_thickness: "6px",
        title: baseTitle,
    },
};

export const BottomBar: Story = {
    args: {
        ...TopBar.args,
        component_id: "bar-bottom",
        id: 2,
        position: "bottom",
        color: "info",
    },
};

export const LeftBar: Story = {
    args: {
        ...TopBar.args,
        component_id: "bar-left",
        id: 3,
        position: "left",
        color: "info",
    },
};

export const RightBar: Story = {
    args: {
        ...TopBar.args,
        component_id: "bar-right",
        id: 4,
        position: "right",
        color: "success",
    },
};

export const ReversedTop: Story = {
    args: {
        ...TopBar.args,
        component_id: "bar-reversed",
        id: 5,
        reversed: true,
        color: "warning",
    },
};

export const ThickBar: Story = {
    args: {
        ...TopBar.args,
        component_id: "bar-thick",
        id: 6,
        bar_thickness: "12px",
        color: "secondary",
    },
};
