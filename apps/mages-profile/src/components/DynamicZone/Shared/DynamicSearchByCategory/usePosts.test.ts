import { act, renderHook, waitFor } from "@testing-library/react";
import usePosts from "./usePosts";
import type { KeyboardEvent } from "react";

const mockPostsData = {
    data: [
        {
            documentId: "post-1",
            title: "Post Alpha",
            slug: "post-alpha",
            description: "Desc A",
        },
        {
            documentId: "post-2",
            title: "Post Beta",
            slug: "post-beta",
            description: "Desc B",
        },
    ],
    meta: {
        pagination: { page: 1, pageSize: 5, pageCount: 3, total: 13 },
    },
};

const mockFetch = (data: unknown, ok = true) =>
    jest.fn().mockResolvedValue({
        ok,
        json: () => Promise.resolve(data),
    } as Response);

const DEFAULT_PARAMS = { posts_count: 5, selectedCategory: "All categories" };

describe("usePosts", () => {
    afterEach(() => {
        delete (global as { fetch?: unknown }).fetch;
    });

    it("starts with expected initial state before the first fetch resolves", () => {
        global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        expect(result.current.searchTerm).toBe("");
        expect(result.current.pageNumber).toBe(1);
        expect(result.current.totalPages).toBe(1);
        expect(result.current.posts).toEqual([]);
        expect(result.current.isResultsOpen).toBe(false);
        expect(result.current.pendingSearch).toBe(false);
    });

    it("fetches posts on mount, sets posts/totalPages, and opens results", async () => {
        global.fetch = mockFetch(mockPostsData);

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(result.current.isResultsOpen).toBe(true));

        expect(result.current.posts).toHaveLength(2);
        expect(result.current.totalPages).toBe(3);
    });

    it("sends a POST to /api/request-posts with posts_count and pageNumber", async () => {
        const fetchSpy = mockFetch(mockPostsData);
        global.fetch = fetchSpy;

        renderHook(() =>
            usePosts({ posts_count: 10, selectedCategory: "All categories" })
        );

        await waitFor(() => expect(fetchSpy).toHaveBeenCalled());

        const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
        const body = JSON.parse(init.body as string);

        expect(url).toBe("/api/request-posts");
        expect(init.method).toBe("POST");
        expect(body.posts_count).toBe(10);
        expect(body.pageNumber).toBe(1);
    });

    it("omits category from the request body when selectedCategory is 'All categories'", async () => {
        const fetchSpy = mockFetch(mockPostsData);
        global.fetch = fetchSpy;

        renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(fetchSpy).toHaveBeenCalled());

        const body = JSON.parse(
            (fetchSpy.mock.calls[0][1] as RequestInit).body as string
        );
        expect(body.category).toBeUndefined();
    });

    it("includes category in the request body when a specific category is selected", async () => {
        const fetchSpy = mockFetch(mockPostsData);
        global.fetch = fetchSpy;

        renderHook(() =>
            usePosts({ posts_count: 5, selectedCategory: "Technology" })
        );

        await waitFor(() => expect(fetchSpy).toHaveBeenCalled());

        const body = JSON.parse(
            (fetchSpy.mock.calls[0][1] as RequestInit).body as string
        );
        expect(body.category).toBe("Technology");
    });

    it("sets posts to [] and totalPages to 1 when fetch returns a non-ok response", async () => {
        global.fetch = mockFetch(null, false);

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(result.current.isResultsOpen).toBe(true));

        expect(result.current.posts).toEqual([]);
        expect(result.current.totalPages).toBe(1);
    });

    it("handleSearch closes results and sets pendingSearch when results are already open", async () => {
        global.fetch = mockFetch(mockPostsData);

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(result.current.isResultsOpen).toBe(true));

        act(() => {
            result.current.handleSearch();
        });

        expect(result.current.isResultsOpen).toBe(false);
        expect(result.current.pendingSearch).toBe(true);
    });

    it("handleKeyDown triggers handleSearch when Enter is pressed", async () => {
        global.fetch = mockFetch(mockPostsData);

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(result.current.isResultsOpen).toBe(true));

        act(() => {
            result.current.handleKeyDown({
                key: "Enter",
            } as KeyboardEvent<HTMLInputElement>);
        });

        expect(result.current.isResultsOpen).toBe(false);
        expect(result.current.pendingSearch).toBe(true);
    });

    it("handleKeyDown does nothing when a non-Enter key is pressed", async () => {
        global.fetch = mockFetch(mockPostsData);

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(result.current.isResultsOpen).toBe(true));

        act(() => {
            result.current.handleKeyDown({
                key: "Escape",
            } as KeyboardEvent<HTMLInputElement>);
        });

        expect(result.current.isResultsOpen).toBe(true);
        expect(result.current.pendingSearch).toBe(false);
    });

    it("handlePageChange updates pageNumber", async () => {
        global.fetch = mockFetch(mockPostsData);

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        await waitFor(() => expect(result.current.isResultsOpen).toBe(true));

        await act(async () => {
            await result.current.handlePageChange(
                {} as React.ChangeEvent<unknown>,
                2
            );
        });

        expect(result.current.pageNumber).toBe(2);
    });

    it("setSearchTerm updates searchTerm", () => {
        global.fetch = jest.fn().mockReturnValue(new Promise(() => {}));

        const { result } = renderHook(() => usePosts(DEFAULT_PARAMS));

        act(() => {
            result.current.setSearchTerm("grand order");
        });

        expect(result.current.searchTerm).toBe("grand order");
    });
});
