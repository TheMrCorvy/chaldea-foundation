import { render, screen } from "@testing-library/react";
import type { Episode } from "@repo/type-definitions";
import type { CSSProperties, ReactNode } from "react";

import EpisodeCard from ".";

interface MockLinkProps {
    href: string | { pathname?: string };
    children: ReactNode;
    style?: CSSProperties;
}

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, style }: MockLinkProps) => {
        const resolvedHref =
            typeof href === "string" ? href : (href.pathname ?? "");

        return (
            <a href={resolvedHref} style={style}>
                {children}
            </a>
        );
    },
}));

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

describe("EpisodeCard", () => {
    it("renders episode details and links to the episode page", () => {
        const episode = createEpisode({
            display_name: "My Episode",
            documentId: "abc123",
        });

        render(<EpisodeCard episode={episode} userId="user-1" />);

        expect(screen.getByText("My Episode")).toBeInTheDocument();
        expect(screen.getByText("Ver ahora")).toBeInTheDocument();

        const link = screen.getByRole("link");
        expect(link.getAttribute("href")).toBe("/episode/abc123");
    });

    it("shows watched badge when user has watched the episode", () => {
        const episode = createEpisode({
            watched_by: {
                data: ["user-1"],
            },
        });

        render(<EpisodeCard episode={episode} userId="user-1" />);

        expect(screen.getByText("VISTO")).toBeInTheDocument();
    });

    it("does not show watched badge when watched list is null", () => {
        const episode = createEpisode({ watched_by: null });

        render(<EpisodeCard episode={episode} userId="user-1" />);

        expect(screen.queryByText("VISTO")).not.toBeInTheDocument();
    });
});
