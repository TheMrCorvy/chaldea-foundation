import { Box } from "@mui/joy";
import type { Directory, Episode } from "@repo/type-definitions";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import RecentAdditions, { RecentAdditionsProps } from ".";

const createDirectory = (overrides: Partial<Directory> = {}): Directory => ({
    id: 1,
    display_name: "Aventura",
    path: "/media/aventura",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    age_rating: "everyone",
    documentId: "dir-aventura",
    publishedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

const createEpisode = (overrides: Partial<Episode> = {}): Episode => ({
    id: 10,
    display_name: "Episodio Uno",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    documentId: "ep-uno",
    version: "V1",
    languages_info: {
        duration: 120,
        extractedAt: new Date("2024-01-01T00:00:00.000Z"),
        audioTracks: [],
        subtitleTracks: [],
    },
    watched_by: {
        data: [],
    },
    publishedAt: "2024-01-01T00:00:00.000Z",
    file_type: "video/mp4",
    ...overrides,
});

const meta = {
    title: "Components/RecentAdditions",
    render: (args: RecentAdditionsProps) => <RecentAdditions {...args} />,
    parameters: {
        layout: "fullscreen",
        nextjs: {
            appDirectory: true,
        },
    },
    decorators: [
        (Story) => (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                }}
            >
                <Story />
            </Box>
        ),
    ],
    args: {
        recentDirectories: [
            createDirectory({
                id: 1,
                display_name: "Drama",
                documentId: "dir-drama",
            }),
            createDirectory({
                id: 2,
                display_name: "Comedia",
                documentId: "dir-comedia",
                path: "/media/comedia",
            }),
            createDirectory({
                id: 3,
                display_name: "Accion",
                documentId: "dir-accion",
                path: "/media/accion",
            }),
        ],
        recentEpisodes: [
            createEpisode({
                id: 10,
                display_name: "Episodio Final",
                documentId: "ep-final",
            }),
            createEpisode({
                id: 11,
                display_name: "Episodio Especial",
                documentId: "ep-especial",
            }),
            createEpisode({
                id: 12,
                display_name: "Episodio Extra",
                documentId: "ep-extra",
            }),
        ],
    },
} satisfies Meta<RecentAdditionsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnlyDirectories: Story = {
    args: {
        recentDirectories: [
            createDirectory({
                id: 21,
                display_name: "Misterio",
                documentId: "dir-misterio",
                path: "/media/misterio",
            }),
            createDirectory({
                id: 22,
                display_name: "Aventura",
                documentId: "dir-aventura-2",
                path: "/media/aventura-2",
            }),
        ],
        recentEpisodes: [],
    },
};

export const OnlyEpisodes: Story = {
    args: {
        recentDirectories: [],
        recentEpisodes: [
            createEpisode({
                id: 31,
                display_name: "Episodio Final",
                documentId: "ep-final-only",
            }),
            createEpisode({
                id: 32,
                display_name: "Episodio Dos",
                documentId: "ep-dos",
            }),
        ],
    },
};

export const EmptyState: Story = {
    args: {
        recentDirectories: [],
        recentEpisodes: [],
    },
};
