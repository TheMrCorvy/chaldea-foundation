import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnimeEpisodeListItem from "./index";

describe("AnimeEpisodeListItem", () => {
    it("should render properly", () => {
        render(
            <AnimeEpisodeListItem
                episodeId={1}
                displayName="test anime episode"
            />
        );

        const animeEpisodeListItem = screen.queryByTestId(
            "test-anime-episode-list-item"
        );

        expect(animeEpisodeListItem).toBeInTheDocument();
    });
});
