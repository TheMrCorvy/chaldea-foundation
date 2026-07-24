import { render, screen } from "@testing-library/react";
import type { Directory, ImageComponent } from "@repo/type-definitions";
import type { CSSProperties, ReactNode } from "react";
import V2SubDirectoryCard from ".";

interface MockLinkProps {
    href: string | { pathname?: string };
    children: ReactNode;
    style?: CSSProperties;
}

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, style }: MockLinkProps) => {
        let resolvedHref = "";
        if (typeof href === "string") {
            resolvedHref = href;
        } else if (href && typeof href === "object" && href.pathname) {
            resolvedHref = href.pathname;
        }

        return (
            <a href={resolvedHref} style={style}>
                {children}
            </a>
        );
    },
}));

const mockCover: ImageComponent = {
    documentId: "cover-1",
    id: 1,
    name: "cover_3fdc4b84b7.jpg",
    alternativeText: null,
    caption: null,
    width: 300,
    height: 450,
    formats: {} as ImageComponent["formats"],
    mime: "image/jpeg",
    url: "/uploads/cover_3fdc4b84b7.jpg",
    publishedAt: "2026-07-18T00:00:00.000Z",
    size: 45,
};

const baseDirectory: Directory = {
    id: 1,
    display_name: "Mock Directory",
    path: "/media/mock",
    createdAt: new Date("2026-07-18T00:00:00.000Z"),
    updatedAt: new Date("2026-07-18T00:00:00.000Z"),
    age_rating: "everyone",
    documentId: "dir-mock",
    publishedAt: "2026-07-18T00:00:00.000Z",
    tags: null,
    cover: mockCover,
    description: null,
    is_processing: false,
};

describe("V2SubDirectoryCard", () => {
    it("renders basic directory details, description, and link correctly", () => {
        const directory = {
            ...baseDirectory,
            display_name: "Aventura e Acción",
            documentId: "abc-xyz",
            description: "Esta es la descripción de prueba.",
        };

        render(
            <V2SubDirectoryCard
                directory={directory}
                imageBaseUrl="https://admin.chaldea.foundation"
            />
        );

        expect(screen.getByText("Aventura e Acción")).toBeInTheDocument();
        expect(
            screen.getByText("Esta es la descripción de prueba.")
        ).toBeInTheDocument();
        expect(screen.getByText("ENTRAR")).toBeInTheDocument();

        const links = screen.getAllByRole("link");
        expect(links.length).toBeGreaterThan(0);
        expect(links[0].getAttribute("href")).toBe("/directory/abc-xyz");
    });

    it("resolves cover image URL properly using imageBaseUrl", () => {
        const directory = {
            ...baseDirectory,
            cover: {
                ...mockCover,
                url: "/uploads/test.jpg",
            },
        };

        render(
            <V2SubDirectoryCard
                directory={directory}
                imageBaseUrl="https://admin.chaldea.foundation"
            />
        );
        const img = screen.getByRole("img");
        expect(img.getAttribute("src")).toBe(
            "https://admin.chaldea.foundation/uploads/test.jpg"
        );
    });

    it("renders tags correctly", () => {
        const directoryWithTags = {
            ...baseDirectory,
            tags: [
                {
                    id: 1,
                    name: "comedia",
                    documentId: "tag-comedia",
                    type_of_category: "media_content",
                },
                {
                    id: 2,
                    name: "fantasía",
                    documentId: "tag-fantasia",
                    type_of_category: "media_content",
                },
            ],
        };

        render(
            <V2SubDirectoryCard
                directory={directoryWithTags}
                imageBaseUrl="https://admin.chaldea.foundation"
            />
        );
        expect(screen.getByText("comedia")).toBeInTheDocument();
        expect(screen.getByText("fantasía")).toBeInTheDocument();
    });
});
