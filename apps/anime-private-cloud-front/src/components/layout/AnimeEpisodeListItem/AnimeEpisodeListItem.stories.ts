import type { Meta, StoryObj } from "@storybook/react";
import AnimeEpisodeListItem, { Props } from ".";

const meta = {
    title: "Layout/AnimeEpisodeListItem",
    component: AnimeEpisodeListItem,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {
    args: {
        displayName: "1 - Test Anime Name",
        episodeId: "1",
    },
};
