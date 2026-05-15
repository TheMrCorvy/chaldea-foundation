import Box from "@mui/joy/Box";
import type { Directory } from "@repo/type-definitions";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SubDirectoriesList, { SubDirectoriesListProps } from ".";

const createDirectory = (overrides: Partial<Directory> = {}): Directory => ({
    id: 1,
    display_name: "Aventura",
    path: "/media/aventura",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    adult: false,
    documentId: "dir-aventura",
    publishedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

const meta = {
    title: "Components/SubDirectoriesList",
    render: (args: SubDirectoriesListProps) => <SubDirectoriesList {...args} />,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    px: 3,
                    py: 6,
                    background:
                        "radial-gradient(circle at 20% 10%, #1f2a44 0%, #0b1020 42%, #05070f 100%)",
                }}
            >
                <Box sx={{ width: "min(1100px, 100%)" }}>
                    <Story />
                </Box>
            </Box>
        ),
    ],
    args: {
        hasEpisodes: true,
        subDirectories: [
            createDirectory({
                id: 1,
                display_name: "Comedia",
                documentId: "dir-comedia",
            }),
            createDirectory({
                id: 2,
                display_name: "Drama",
                documentId: "dir-drama",
            }),
        ],
    },
} satisfies Meta<SubDirectoriesListProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAdultDirectory: Story = {
    args: {
        hasEpisodes: false,
        subDirectories: [
            createDirectory({
                id: 3,
                display_name: "General",
                documentId: "dir-general",
                adult: false,
            }),
            createDirectory({
                id: 4,
                display_name: "+18",
                documentId: "dir-adult",
                adult: true,
            }),
        ],
    },
};

export const EmptyState: Story = {
    args: {
        hasEpisodes: false,
        subDirectories: [],
    },
};
