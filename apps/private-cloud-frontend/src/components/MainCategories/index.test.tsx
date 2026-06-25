import { fireEvent, render, screen } from "@testing-library/react";
import type { Directory } from "@repo/type-definitions";

import MainCategories from ".";

const mockRedirect = jest.fn<void, [string]>();

jest.mock("next/navigation", () => ({
    redirect: (url: string) => mockRedirect(url),
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

describe("MainCategories", () => {
    beforeEach(() => {
        mockRedirect.mockClear();
    });

    it("renders one button per directory", () => {
        const directories: Directory[] = [
            createDirectory({
                id: 1,
                display_name: "Aventura",
                documentId: "dir-aventura",
            }),
            createDirectory({
                id: 2,
                display_name: "Drama",
                documentId: "dir-drama",
            }),
        ];

        render(<MainCategories directories={directories} />);

        expect(
            screen.getByRole("button", { name: "Votar por Aventura" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Votar por Drama" })
        ).toBeInTheDocument();
    });

    it("redirects to selected directory when clicking a category", () => {
        const directories: Directory[] = [
            createDirectory({
                id: 7,
                display_name: "Comedia",
                documentId: "dir-comedia",
            }),
        ];

        render(<MainCategories directories={directories} />);

        fireEvent.click(
            screen.getByRole("button", { name: "Votar por Comedia" })
        );

        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith("/directory/dir-comedia");
    });

    it("renders no category buttons when directories are empty", () => {
        render(<MainCategories directories={[]} />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});
