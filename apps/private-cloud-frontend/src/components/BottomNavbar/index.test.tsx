import { fireEvent, render, screen } from "@testing-library/react";
import type { Directory } from "@repo/type-definitions";
import type { SetStateAction } from "react";

import BottomNav from ".";
import useNavActions from "./useNavActions";

jest.mock("./useStyles", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        root: {},
        sheet: {},
    })),
}));

jest.mock("./useNavActions");

jest.mock("../NavAction/index", () => ({
    __esModule: true,
    default: ({
        label,
        value,
        onClick,
    }: {
        label: string;
        value: string;
        onClick: () => void;
    }) => (
        <button aria-label={label} data-value={value} onClick={onClick}>
            {label}
        </button>
    ),
}));

jest.mock("../DrawerList", () => ({
    __esModule: true,
    default: ({
        open,
        closeDrawer,
    }: {
        open: boolean;
        closeDrawer: () => void;
    }) => (
        <div>
            <span>drawer-open: {String(open)}</span>
            <button onClick={closeDrawer}>close drawer</button>
        </div>
    ),
}));

jest.mock("../SearchModal", () => ({
    __esModule: true,
    default: ({
        open,
        onClose,
        children,
    }: {
        open: boolean;
        onClose: () => void;
        children: React.ReactNode;
    }) => (
        <div>
            <span>search-open: {String(open)}</span>
            <button onClick={onClose}>close search</button>
            {children}
        </div>
    ),
}));

jest.mock("../Search", () => ({
    __esModule: true,
    default: ({ allowAdultContent }: { allowAdultContent: boolean }) => (
        <span>search-allow-adult: {String(allowAdultContent)}</span>
    ),
}));

jest.mock("../SendReport", () => ({
    __esModule: true,
    default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
        <div>
            <span>report-open: {String(open)}</span>
            <button onClick={onClose}>close report</button>
        </div>
    ),
}));

const mockedUseNavActions = jest.mocked(useNavActions);

const createDirectory = (overrides: Partial<Directory> = {}): Directory => ({
    id: 1,
    display_name: "Aventura",
    path: "/media/aventura",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    adult: false,
    documentId: "dir-aventura",
    publishedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
});

describe("BottomNavbar", () => {
    beforeEach(() => {
        mockedUseNavActions.mockReset();
    });

    it("renders all default actions and modal states", () => {
        const reportAction = {
            label: "Reportar problema",
            icon: <span>report</span>,
            value: "report",
            action: jest.fn(),
        };
        const listAction = {
            label: "Lista",
            icon: <span>list</span>,
            value: "list",
            action: jest.fn(),
        };
        const goHomeAction = {
            label: "Inicio",
            icon: <span>home</span>,
            value: "home",
            action: jest.fn(),
        };
        const searchAction = {
            label: "Buscar",
            icon: <span>search</span>,
            value: "search",
            action: jest.fn(),
        };
        const logoutAction = {
            label: "Cerrar sesión",
            icon: <span>logout</span>,
            value: "logout",
            action: jest.fn(),
        };

        mockedUseNavActions.mockReturnValue({
            actions: [
                reportAction,
                listAction,
                goHomeAction,
                searchAction,
                logoutAction,
            ],
            drawerOpen: false,
            setDrawerOpen: jest.fn<void, [SetStateAction<boolean>]>(),
            searchModalOpen: false,
            setSearchModalOpen: jest.fn<void, [SetStateAction<boolean>]>(),
            reportModalOpen: false,
            setReportModalOpen: jest.fn<void, [SetStateAction<boolean>]>(),
            goBackAction: {
                label: "Volver atrás",
                icon: <span>back</span>,
                value: "back",
                action: jest.fn(),
            },
            logoutAction,
        });

        render(<BottomNav mainDirectories={[createDirectory()]} />);

        expect(
            screen.getByRole("button", { name: "Reportar problema" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Lista" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Inicio" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Buscar" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cerrar sesión" })
        ).toBeInTheDocument();

        expect(screen.getByText("drawer-open: false")).toBeInTheDocument();
        expect(screen.getByText("search-open: false")).toBeInTheDocument();
        expect(screen.getByText("report-open: false")).toBeInTheDocument();
        expect(
            screen.getByText("search-allow-adult: false")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Lista" }));
        expect(listAction.action).toHaveBeenCalledTimes(1);
    });

    it("renders go-back action only when onlyGoBack is true", () => {
        const goBackAction = {
            label: "Volver atrás",
            icon: <span>back</span>,
            value: "back",
            action: jest.fn(),
        };

        mockedUseNavActions.mockReturnValue({
            actions: [
                {
                    label: "Inicio",
                    icon: <span>home</span>,
                    value: "home",
                    action: jest.fn(),
                },
            ],
            drawerOpen: true,
            setDrawerOpen: jest.fn<void, [SetStateAction<boolean>]>(),
            searchModalOpen: true,
            setSearchModalOpen: jest.fn<void, [SetStateAction<boolean>]>(),
            reportModalOpen: true,
            setReportModalOpen: jest.fn<void, [SetStateAction<boolean>]>(),
            goBackAction,
            logoutAction: {
                label: "Cerrar sesión",
                icon: <span>logout</span>,
                value: "logout",
                action: jest.fn(),
            },
        });

        render(<BottomNav mainDirectories={[createDirectory()]} onlyGoBack />);

        expect(
            screen.getByRole("button", { name: "Volver atrás" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Inicio" })
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Volver atrás" }));
        expect(goBackAction.action).toHaveBeenCalledTimes(1);
    });

    it("renders only logout action when navbar is disabled and forwards close callbacks", () => {
        const setDrawerOpen = jest.fn<void, [SetStateAction<boolean>]>();
        const setSearchModalOpen = jest.fn<void, [SetStateAction<boolean>]>();
        const setReportModalOpen = jest.fn<void, [SetStateAction<boolean>]>();
        const logoutAction = {
            label: "Cerrar sesión",
            icon: <span>logout</span>,
            value: "logout",
            action: jest.fn(),
        };

        mockedUseNavActions.mockReturnValue({
            actions: [
                {
                    label: "Buscar",
                    icon: <span>search</span>,
                    value: "search",
                    action: jest.fn(),
                },
            ],
            drawerOpen: true,
            setDrawerOpen,
            searchModalOpen: true,
            setSearchModalOpen,
            reportModalOpen: true,
            setReportModalOpen,
            goBackAction: {
                label: "Volver atrás",
                icon: <span>back</span>,
                value: "back",
                action: jest.fn(),
            },
            logoutAction,
        });

        render(
            <BottomNav
                mainDirectories={[createDirectory()]}
                disableNavbar
                allowAdultContent
            />
        );

        expect(
            screen.getByRole("button", { name: "Cerrar sesión" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: "Buscar" })
        ).not.toBeInTheDocument();
        expect(
            screen.getByText("search-allow-adult: true")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
        expect(logoutAction.action).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole("button", { name: "close drawer" }));
        fireEvent.click(screen.getByRole("button", { name: "close search" }));
        fireEvent.click(screen.getByRole("button", { name: "close report" }));

        expect(setDrawerOpen).toHaveBeenCalledWith(false);
        expect(setSearchModalOpen).toHaveBeenCalledWith(false);
        expect(setReportModalOpen).toHaveBeenCalledWith(false);
    });
});
