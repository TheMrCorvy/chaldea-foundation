import type { Meta, StoryObj } from "@storybook/react";
import DynamicPdfFile from "./index";
import StarryContainer from "../../../StarryContainer";

const meta = {
    title: "DynamicZone/DynamicPdfFile",
    component: DynamicPdfFile,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <StarryContainer>
                <div
                    style={{
                        padding: "60px",
                        minWidth: "300px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Story />
                </div>
            </StarryContainer>
        ),
    ],
} satisfies Meta<typeof DynamicPdfFile>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generic mock PDF file info
const mockFileUrl = "/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export const Default: Story = {
    args: {
        __component: "layout.pdf-component",
        component_id: "pdf-1",
        title: "Download Status Report",
        id: 1,
        file: {
            url: mockFileUrl,
            name: "Agent_Status_Report.pdf",
        },
        filesBaseUrl: "https://www.w3.org",
    },
};

export const WithIconAndHelperText: Story = {
    args: {
        __component: "layout.pdf-component",
        component_id: "pdf-2",
        title: "Mission Briefing",
        id: 1,
        file: {
            url: mockFileUrl,
        },
        icon: {
            id: 1,
            __component: "layout.icon",
            component_id: "icon-1",
            title: "Download Icon",
            name: "Download",
            color: "inherit",
        },
        helper_text: "Security Level 4 Required. File size: 2.4 MB.",
        filesBaseUrl: "https://www.w3.org",
    },
};

export const WithPopoverTooltip: Story = {
    args: {
        __component: "layout.pdf-component",
        component_id: "pdf-3",
        title: "Classified Intel",
        id: 1,
        popover:
            "Contains sensitive data about Singularities. Proceed with caution.",
        file: {
            url: mockFileUrl,
        },
        icon: {
            id: 1,
            __component: "layout.icon",
            component_id: "icon-2",
            title: "Warning Icon",
            name: "Warning",
            color: "warning",
        },
        helper_text: "Restricted Access Only",
        filesBaseUrl: "https://www.w3.org",
    },
};

export const MissingFileDisabled: Story = {
    args: {
        id: 1,
        __component: "layout.pdf-component",
        component_id: "pdf-4",
        title: "Corrupted Data Fragment",
        popover: "File not found on the server.",
        file: null, // Forces a disabled state
        helper_text: "Download unavailable.",
        filesBaseUrl: "https://www.w3.org",
    },
};
