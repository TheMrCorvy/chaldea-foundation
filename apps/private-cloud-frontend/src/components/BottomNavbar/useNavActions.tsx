import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import BugReportIcon from "@mui/icons-material/BugReport";
import { redirect } from "next/navigation";
import { WebRoutes } from "@/utils/routes";
import ReplyIcon from "@mui/icons-material/Reply";
import { useState } from "react";

const useNavActions = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const goBackAction = {
        label: "Volver atrás",
        icon: (
            <ReplyIcon
                sx={{
                    fontSize: {
                        xs: 20,
                        lg: 24,
                        xl: 32,
                    },
                }}
            />
        ),
        value: "back",
        action: () => window.history.back(),
    };

    const listAction = {
        label: "Lista",
        icon: (
            <ListIcon
                sx={{
                    fontSize: {
                        xs: 20,
                        lg: 24,
                        xl: 32,
                    },
                }}
            />
        ),
        value: "list",
        action: () => setDrawerOpen(true),
    };

    const goHomeAction = {
        label: "Inicio",
        icon: (
            <HomeIcon
                sx={{
                    fontSize: {
                        xs: 20,
                        lg: 24,
                        xl: 32,
                    },
                }}
            />
        ),
        value: "home",
        action: () => redirect(WebRoutes.HOME),
    };

    const searchAction = {
        label: "Buscar",
        icon: (
            <SearchIcon
                sx={{
                    fontSize: {
                        xs: 20,
                        lg: 24,
                        xl: 32,
                    },
                }}
            />
        ),
        value: "search",
        action: () => setSearchModalOpen(true),
    };

    const reportAction = {
        label: "Reportar",
        icon: (
            <BugReportIcon
                sx={{
                    fontSize: {
                        xs: 20,
                        lg: 24,
                        xl: 32,
                    },
                }}
            />
        ),
        value: "report",
        action: () => setReportModalOpen(true),
    };

    const logoutAction = {
        label: "Cerrar sesión",
        icon: (
            <LogoutIcon
                sx={{
                    fontSize: {
                        xs: 20,
                        lg: 24,
                        xl: 32,
                    },
                }}
            />
        ),
        value: "logout",
        action: async () => {
            await fetch("/api/logout", {
                method: "POST",
            });
            redirect(WebRoutes.LOGIN);
        },
    };

    const actions = [
        reportAction,
        listAction,
        goHomeAction,
        searchAction,
        logoutAction,
    ];

    return {
        actions,
        drawerOpen,
        setDrawerOpen,
        searchModalOpen,
        setSearchModalOpen,
        reportModalOpen,
        setReportModalOpen,
        goBackAction,
        logoutAction,
    };
};

export default useNavActions;
