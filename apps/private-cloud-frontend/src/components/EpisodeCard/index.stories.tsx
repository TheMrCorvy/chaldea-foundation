import Box from "@mui/joy/Box";
import type { Episode } from "@repo/type-definitions";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import EpisodeCard, { EpisodeCardProps } from ".";

const createEpisode = (overrides: Partial<Episode> = {}): Episode => ({
    id: 1,
    display_name: "Episode One",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    documentId: "episode-1",
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
    title: "Components/EpisodeCard",
    render: (args: EpisodeCardProps) => <EpisodeCard {...args} />,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    background:
                        "radial-gradient(circle at 20% 10%, #1f2a44 0%, #0b1020 42%, #05070f 100%)",
                }}
            >
                <Box
                    sx={{
                        transform: "translateY(-8px)",
                        filter: "drop-shadow(0 24px 35px rgba(0, 0, 0, 0.55))",
                    }}
                >
                    <Story />
                </Box>
            </Box>
        ),
    ],
    args: {
        episode: createEpisode(),
        userId: "user-1",
    },
} satisfies Meta<EpisodeCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WatchedByCurrentUser: Story = {
    args: {
        episode: createEpisode({
            display_name: "Episode Watched",
            watched_by: {
                data: ["user-1"],
            },
        }),
    },
};

export const NotWatchedByCurrentUser: Story = {
    args: {
        episode: createEpisode({
            display_name: "Episode Unwatched",
            documentId: "episode-2",
            watched_by: {
                data: ["another-user"],
            },
        }),
    },
};

export const NullWatchedList: Story = {
    args: {
        episode: createEpisode({
            display_name: "Episode With Null Watched List",
            documentId: "episode-3",
            watched_by: null,
        }),
    },
};
