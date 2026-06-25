import { fireEvent, render, screen } from "@testing-library/react";
import { GroupedDirectories } from "@/utils/directories";
import DrawerListContent from ".";

jest.mock("../DrawerEpisodesList", () => ({
    __esModule: true,
    default: ({ parentId }: { parentId: string }) => (
        <div data-testid="drawer-episodes-list">{parentId}</div>
    ),
}));

describe("DrawerListContent", () => {
    it("shows loader when loadingState is loading", () => {
        render(
            <DrawerListContent
                loadingState="loading"
                directories={undefined}
                parentId="parent-1"
            />
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("shows error message when loadingState is failed", () => {
        render(
            <DrawerListContent
                loadingState="failed"
                directories={undefined}
                parentId="parent-1"
            />
        );

        expect(
            screen.getByText(
                "Algo salió mal al cargar los directorios. Contáctate con el administrador de la página."
            )
        ).toBeInTheDocument();
    });

    it("renders grouped directories and toggles section content", () => {
        const directories: GroupedDirectories = {
            a: [
                {
                    label: "Aventura",
                    url: "dir-aventura",
                    age_rating: "explicit",
                },
            ],
        };

        render(
            <DrawerListContent
                loadingState="succeeded"
                directories={directories}
                parentId="parent-1"
            />
        );

        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: "Aventura" })
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /A\s*1/i }));

        const directoryLink = screen.getByRole("link", { name: "Aventura" });
        expect(directoryLink).toBeInTheDocument();
        expect(directoryLink).toHaveAttribute(
            "href",
            "/directory/dir-aventura"
        );
    });

    it("renders DrawerEpisodesList when directories are empty", () => {
        render(
            <DrawerListContent
                loadingState="succeeded"
                directories={{}}
                parentId="parent-empty"
            />
        );

        expect(screen.getByTestId("drawer-episodes-list")).toHaveTextContent(
            "parent-empty"
        );
    });
});
