import { act, renderHook, waitFor } from "@testing-library/react";
import useCategories from "./useCategories";

const mockFetch = (data: unknown, ok = true) =>
    jest.fn().mockResolvedValue({
        ok,
        json: () => Promise.resolve(data),
    } as Response);

describe("useCategories", () => {
    afterEach(() => {
        delete (global as { fetch?: unknown }).fetch;
    });

    it("starts with empty categories, loading true, and selectedCategory 'All categories'", () => {
        global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

        const { result } = renderHook(() => useCategories());

        expect(result.current.categories).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.selectedCategory).toBe("All categories");
    });

    it("calls /api/request-categories on mount", async () => {
        const fetchSpy = mockFetch([]);
        global.fetch = fetchSpy;

        renderHook(() => useCategories());

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith("/api/request-categories");
        });
    });

    it("sets categories from a flat array response", async () => {
        const mockData = [
            { id: 1, name: "Technology", documentId: "cat-1" },
            { id: 2, name: "Science", documentId: "cat-2" },
        ];
        global.fetch = mockFetch(mockData);

        const { result } = renderHook(() => useCategories());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.categories).toEqual(mockData);
    });

    it("sets categories from a { data: [] } wrapped response", async () => {
        const mockData = [{ id: 3, name: "Arts", documentId: "cat-3" }];
        global.fetch = mockFetch({ data: mockData });

        const { result } = renderHook(() => useCategories());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.categories).toEqual(mockData);
    });

    it("leaves categories empty and sets loading false when response is not ok", async () => {
        global.fetch = mockFetch(null, false);

        const { result } = renderHook(() => useCategories());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.categories).toEqual([]);
    });

    it("leaves categories empty and sets loading false when fetch throws", async () => {
        global.fetch = jest
            .fn()
            .mockRejectedValue(new Error("Network failure"));

        const { result } = renderHook(() => useCategories());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.categories).toEqual([]);
    });

    it("updates selectedCategory when setSelectedCategory is called", async () => {
        global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

        const { result } = renderHook(() => useCategories());

        act(() => {
            result.current.setSelectedCategory("Technology");
        });

        expect(result.current.selectedCategory).toBe("Technology");
    });
});
