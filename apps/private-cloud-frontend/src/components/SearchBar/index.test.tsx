import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SearchBar, { SearchBarProps, SearchParams } from ".";

interface MockPaginationProps {
    pagination: {
        page: number;
        pageCount: number;
        pageSize: number;
        total: number;
    };
    onChange: (newPage: number) => Promise<void>;
}

const mockPagination = jest.fn<void, [MockPaginationProps]>();

jest.mock("../Pagination", () => ({
    __esModule: true,
    default: (props: MockPaginationProps) => {
        mockPagination(props);

        return (
            <button type="button" onClick={() => void props.onChange(4)}>
                Cambiar pagina
            </button>
        );
    },
}));

const createPagination = (
    overrides: Partial<SearchBarProps["pagination"]> = {}
): SearchBarProps["pagination"] => ({
    page: 2,
    pageCount: 5,
    total: 0,
    ...overrides,
});

describe("SearchBar", () => {
    beforeEach(() => {
        mockPagination.mockClear();
    });

    it("submits trimmed query with current page", async () => {
        const handleSubmit = jest
            .fn<Promise<void>, [SearchParams]>()
            .mockResolvedValue(undefined);

        render(
            <SearchBar
                handleSubmit={handleSubmit}
                pagination={createPagination({ page: 3 })}
            />
        );

        const input = screen.getByPlaceholderText("Buscar...");
        fireEvent.change(input, { target: { value: "   One Piece   " } });

        const form = input.closest("form");
        expect(form).not.toBeNull();

        if (!form) {
            throw new Error("Search form not found");
        }

        fireEvent.submit(form);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });

        expect(handleSubmit).toHaveBeenCalledWith({
            query: "One Piece",
            switchAdult: false,
            switchOnlyAdult: false,
            switchExplicit: false,
            switchOnlyExplicit: false,
            page: 3,
        });
    });

    it("does not submit when query is empty after trim", async () => {
        const handleSubmit = jest
            .fn<Promise<void>, [SearchParams]>()
            .mockResolvedValue(undefined);

        render(
            <SearchBar
                handleSubmit={handleSubmit}
                pagination={createPagination()}
            />
        );

        const input = screen.getByPlaceholderText("Buscar...");
        fireEvent.change(input, { target: { value: "   " } });

        const form = input.closest("form");
        expect(form).not.toBeNull();

        if (!form) {
            throw new Error("Search form not found");
        }

        fireEvent.submit(form);

        await waitFor(() => {
            expect(handleSubmit).not.toHaveBeenCalled();
        });
    });

    it("renders adult filters and submits when toggles change", async () => {
        const handleSubmit = jest
            .fn<Promise<void>, [SearchParams]>()
            .mockResolvedValue(undefined);

        render(
            <SearchBar
                allowAdultContent
                handleSubmit={handleSubmit}
                pagination={createPagination({ page: 7 })}
            />
        );

        expect(
            screen.getByText("Permitir contenido para adultos")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Buscar solo contenido para adultos")
        ).toBeInTheDocument();

        const allowAdultSwitch = screen.getByRole("switch", {
            name: "Permitir contenido para adultos",
        });
        const onlyAdultSwitch = screen.getByRole("switch", {
            name: "Buscar solo contenido para adultos",
        });

        fireEvent.click(allowAdultSwitch);
        fireEvent.click(onlyAdultSwitch);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(2);
        });

        expect(handleSubmit).toHaveBeenNthCalledWith(1, {
            query: "",
            switchAdult: true,
            switchOnlyAdult: false,
            switchExplicit: false,
            switchOnlyExplicit: false,
            page: 7,
        });
        expect(handleSubmit).toHaveBeenNthCalledWith(2, {
            query: "",
            switchAdult: true,
            switchOnlyAdult: true,
            switchExplicit: false,
            switchOnlyExplicit: false,
            page: 7,
        });
    });

    it("renders pagination only when total is greater than zero", () => {
        const handleSubmit = jest
            .fn<Promise<void>, [SearchParams]>()
            .mockResolvedValue(undefined);

        const { rerender } = render(
            <SearchBar
                handleSubmit={handleSubmit}
                pagination={createPagination({ total: 0 })}
            />
        );

        expect(screen.queryByText("Cambiar pagina")).not.toBeInTheDocument();

        rerender(
            <SearchBar
                handleSubmit={handleSubmit}
                pagination={createPagination({ total: 50 })}
            />
        );

        expect(screen.getByText("Cambiar pagina")).toBeInTheDocument();
        expect(mockPagination).toHaveBeenCalledTimes(1);
    });

    it("submits selected page from pagination callback", async () => {
        const handleSubmit = jest
            .fn<Promise<void>, [SearchParams]>()
            .mockResolvedValue(undefined);

        render(
            <SearchBar
                handleSubmit={handleSubmit}
                pagination={createPagination({ page: 1, total: 20 })}
            />
        );

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
            target: { value: "Bleach" },
        });

        fireEvent.click(screen.getByText("Cambiar pagina"));

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });

        expect(handleSubmit).toHaveBeenCalledWith({
            query: "Bleach",
            switchAdult: false,
            switchOnlyAdult: false,
            switchExplicit: false,
            switchOnlyExplicit: false,
            page: 4,
        });
    });
});
