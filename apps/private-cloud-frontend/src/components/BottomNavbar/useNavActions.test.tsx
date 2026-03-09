import { act, renderHook } from "@testing-library/react";
import { redirect } from "next/navigation";

import { WebRoutes } from "@/utils/routes";
import useNavActions from "./useNavActions";

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

const mockedRedirect = jest.mocked(redirect);

describe("useNavActions", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        mockedRedirect.mockClear();
        global.fetch = jest.fn<
            ReturnType<typeof fetch>,
            Parameters<typeof fetch>
        >(() => Promise.resolve({ ok: true } as Response));
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    it("initializes with all modal states closed and exposes expected actions", () => {
        const { result } = renderHook(() => useNavActions());

        expect(result.current.drawerOpen).toBe(false);
        expect(result.current.searchModalOpen).toBe(false);
        expect(result.current.reportModalOpen).toBe(false);
        expect(result.current.actions.map((action) => action.value)).toEqual([
            "report",
            "list",
            "home",
            "search",
            "logout",
        ]);
        expect(result.current.goBackAction.value).toBe("back");
    });

    it("opens drawer, search modal and report modal through action handlers", () => {
        const { result } = renderHook(() => useNavActions());

        act(() => {
            result.current.actions
                .find((action) => action.value === "list")
                ?.action();
            result.current.actions
                .find((action) => action.value === "search")
                ?.action();
            result.current.actions
                .find((action) => action.value === "report")
                ?.action();
        });

        expect(result.current.drawerOpen).toBe(true);
        expect(result.current.searchModalOpen).toBe(true);
        expect(result.current.reportModalOpen).toBe(true);
    });

    it("uses browser history for go back and redirects to home", () => {
        const historyBackSpy = jest
            .spyOn(window.history, "back")
            .mockImplementation(() => undefined);

        const { result } = renderHook(() => useNavActions());

        act(() => {
            result.current.goBackAction.action();
            result.current.actions
                .find((action) => action.value === "home")
                ?.action();
        });

        expect(historyBackSpy).toHaveBeenCalledTimes(1);
        expect(mockedRedirect).toHaveBeenCalledWith(WebRoutes.HOME);

        historyBackSpy.mockRestore();
    });

    it("logs out through api and redirects to login", async () => {
        const { result } = renderHook(() => useNavActions());

        await act(async () => {
            await result.current.logoutAction.action();
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/logout", {
            method: "POST",
        });
        expect(mockedRedirect).toHaveBeenCalledWith(WebRoutes.LOGIN);
    });
});
