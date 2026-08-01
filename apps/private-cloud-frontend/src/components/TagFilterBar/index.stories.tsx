import Box from "@mui/joy/Box";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "@storybook/test";
import TagFilterBar, { TagFilterBarProps } from ".";
import type { BlogPostCategory } from "@repo/type-definitions";

const mockTags: BlogPostCategory[] = [
    {
        id: 1,
        name: "anime",
        documentId: "t1",
        type_of_category: "media_content",
    },
    {
        id: 2,
        name: "acción",
        documentId: "t2",
        type_of_category: "media_content",
    },
    {
        id: 3,
        name: "comedia",
        documentId: "t3",
        type_of_category: "media_content",
    },
    {
        id: 4,
        name: "fantasía",
        documentId: "t4",
        type_of_category: "media_content",
    },
    {
        id: 5,
        name: "drama",
        documentId: "t5",
        type_of_category: "media_content",
    },
    {
        id: 6,
        name: "romance",
        documentId: "t6",
        type_of_category: "media_content",
    },
];

const meta = {
    title: "Components/TagFilterBar",
    component: TagFilterBar,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story: React.ComponentType<object>) => (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    p: 4,
                    background:
                        "radial-gradient(circle at 20% 10%, #1f2a44 0%, #0b1020 42%, #05070f 100%)",
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 800 }}>
                    <Story />
                </Box>
            </Box>
        ),
    ],
    args: {
        tags: mockTags,
        selectedTagIds: [],
        onTagToggle: fn(),
        onClearAll: fn(),
    },
} satisfies Meta<TagFilterBarProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelections: Story = {
    args: {
        selectedTagIds: [1, 3],
    },
};

export const AllSelected: Story = {
    args: {
        selectedTagIds: mockTags.map((t) => t.id),
    },
};

export const NoTags: Story = {
    args: {
        tags: [],
    },
};
