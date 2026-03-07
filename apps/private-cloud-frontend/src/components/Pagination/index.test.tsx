import { fireEvent, render, screen } from "@testing-library/react";
import type { PaginationObject } from "@repo/type-definitions";

import Pagination from ".";

const createPagination = (
    overrides: Partial<PaginationObject> = {}
): PaginationObject => ({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total: 10,
    ...overrides,
});

describe("Pagination", () => {
    it("returns null when there is only one page", () => {
        render(
            <Pagination
                pagination={createPagination({ page: 1, pageCount: 1 })}
                onChange={jest.fn<void, [number]>()}
            />
        );

        expect(
            screen.queryByRole("button", { name: /previous page/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /next page/i })
        ).not.toBeInTheDocument();
    });

    it("renders all page buttons when pageCount is less than or equal to seven", () => {
        render(
            <Pagination
                pagination={createPagination({
                    page: 3,
                    pageCount: 5,
                    total: 50,
                })}
                onChange={jest.fn<void, [number]>()}
            />
        );

        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
        expect(screen.queryByText("···")).not.toBeInTheDocument();
    });

    it("calls onChange for previous, next, and direct page clicks", () => {
        const onChange = jest.fn<void, [number]>();

        render(
            <Pagination
                pagination={createPagination({
                    page: 3,
                    pageCount: 6,
                    total: 60,
                })}
                onChange={onChange}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /previous page/i }));
        fireEvent.click(screen.getByRole("button", { name: /next page/i }));
        fireEvent.click(screen.getByRole("button", { name: "5" }));

        expect(onChange).toHaveBeenNthCalledWith(1, 2);
        expect(onChange).toHaveBeenNthCalledWith(2, 4);
        expect(onChange).toHaveBeenNthCalledWith(3, 5);
    });

    it("renders end ellipsis when current page is near the start", () => {
        render(
            <Pagination
                pagination={createPagination({
                    page: 2,
                    pageCount: 10,
                    total: 100,
                })}
                onChange={jest.fn<void, [number]>()}
            />
        );

        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
        expect(screen.getAllByText("···")).toHaveLength(1);
    });

    it("renders both ellipses when current page is in the middle", () => {
        render(
            <Pagination
                pagination={createPagination({
                    page: 5,
                    pageCount: 10,
                    total: 100,
                })}
                onChange={jest.fn<void, [number]>()}
            />
        );

        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "6" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
        expect(screen.getAllByText("···")).toHaveLength(2);
    });
});
