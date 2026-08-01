import { render, screen } from "@testing-library/react";
import type { Directory } from "@repo/type-definitions";

import SubDirectoriesList from ".";

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

describe("SubDirectoriesList", () => {
    it("returns null when there are no sub-directories", () => {
        render(<SubDirectoriesList subDirectories={[]} hasEpisodes={false} />);

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders one link per sub-directory with the correct route", () => {
        const subDirectories: Directory[] = [
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
        ];

        render(
            <SubDirectoriesList
                subDirectories={subDirectories}
                hasEpisodes={true}
            />
        );

        const comedyLink = screen.getByRole("link", { name: /comedia/i });
        const dramaLink = screen.getByRole("link", { name: /drama/i });

        expect(comedyLink).toBeInTheDocument();
        expect(comedyLink.getAttribute("href")).toBe("/directory/dir-comedia");
        expect(dramaLink).toBeInTheDocument();
        expect(dramaLink.getAttribute("href")).toBe("/directory/dir-drama");
    });

    it("renders one link per sub-directory regardless of age rating", () => {
        const subDirectories: Directory[] = [
            createDirectory({
                id: 3,
                display_name: "General",
                documentId: "dir-general",
                age_rating: "everyone",
            }),
            createDirectory({
                id: 4,
                display_name: "+18",
                documentId: "dir-adult",
                age_rating: "adults",
            }),
        ];

        render(
            <SubDirectoriesList
                subDirectories={subDirectories}
                hasEpisodes={false}
            />
        );

        const generalLink = screen.getByRole("link", { name: /general/i });
        const adultLink = screen.getByRole("link", { name: /\+18/i });

        expect(generalLink).toBeInTheDocument();
        expect(generalLink.getAttribute("href")).toBe("/directory/dir-general");
        expect(adultLink).toBeInTheDocument();
        expect(adultLink.getAttribute("href")).toBe("/directory/dir-adult");
    });
});
