import type { Meta, StoryObj } from "@storybook/react";
import AnimeEpisodeListItem from ".";

const meta = {
    title: "Layout/AnimeEpisodeListItem",
    component: AnimeEpisodeListItem,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof AnimeEpisodeListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        displayName: "1 - Test Anime Name",
        episodeId: "1",
    },
};
