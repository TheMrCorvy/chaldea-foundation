import { fireEvent, render, screen } from "@testing-library/react";
import type { Directory, Episode } from "@repo/type-definitions";

import RecentAdditions from ".";

const mockPush = jest.fn<void, [string]>();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

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

describe("RecentAdditions", () => {
    beforeEach(() => {
        mockPush.mockClear();
    });

    it("renders title and tabs", () => {
        render(
            <RecentAdditions
                recentDirectories={[createDirectory()]}
                recentEpisodes={[createEpisode()]}
            />
        );

        expect(screen.getByText("Adiciones Recientes")).toBeInTheDocument();
        expect(
            screen.getByRole("tab", { name: "Directorios" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("tab", { name: "Episodios" })
        ).toBeInTheDocument();
    });

    it("navigates to a directory when clicking a directory card", () => {
        render(
            <RecentAdditions
                recentDirectories={[
                    createDirectory({
                        display_name: "Drama",
                        documentId: "dir-drama",
                    }),
                ]}
                recentEpisodes={[]}
            />
        );

        fireEvent.click(screen.getByText("Drama"));

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/directory/dir-drama");
    });

    it("navigates to an episode when selecting episode tab and clicking an episode card", () => {
        render(
            <RecentAdditions
                recentDirectories={[]}
                recentEpisodes={[
                    createEpisode({
                        display_name: "Episodio Final",
                        documentId: "ep-final",
                    }),
                ]}
            />
        );

        fireEvent.click(screen.getByRole("tab", { name: "Episodios" }));
        fireEvent.click(screen.getByText("Episodio Final"));

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/episode/ep-final");
    });
});
