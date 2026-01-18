import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import { redirect } from "next/navigation";
import { WebRoutes } from "@/utils/routes";
import ReplyIcon from "@mui/icons-material/Reply";
import { useState } from "react";

const useNavActions = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    const actions = [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
    ];

    return {
        actions,
        drawerOpen,
        setDrawerOpen,
        searchModalOpen,
        setSearchModalOpen,
    };
};

export default useNavActions;
