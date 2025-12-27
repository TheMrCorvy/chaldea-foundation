"use client";

import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import { CSSProperties, FC, useState } from "react";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import DrawerList from "../DrawerList";
import { redirect } from "next/navigation";
import { WebRoutes } from "@/utils/routes";
import NavAction from "../NavAction/index";
import useStyles from "./useStyles";
import { Box } from "@mui/joy";
import ReplyIcon from "@mui/icons-material/Reply";
import { Directory } from "@repo/type-definitions";
import SearchModal from "../SearchModal";
import Search from "../Search";

export interface BottomNavbProps {
    disableNavbar?: boolean;
    mainDirectories: Directory[];
    onlyGoBack?: boolean;
    allowAdultContent?: boolean;
}

const BottomNav: FC<BottomNavbProps> = ({
    disableNavbar = false,
    mainDirectories,
    onlyGoBack = false,
    allowAdultContent = false,
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const { root, sheet } = useStyles();

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

    return (
        <Box component="nav" style={root as CSSProperties}>
            <Sheet variant="solid" color="primary" sx={sheet}>
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    gap={{
                        xs: 0.5,
                        sm: 1,
                    }}
                >
                    {!disableNavbar &&
                        !onlyGoBack &&
                        actions.map((action) => (
                            <NavAction
                                key={action.value}
                                label={action.label}
                                icon={action.icon}
                                value={action.value}
                                onClick={() => action.action()}
                            />
                        ))}

                    {onlyGoBack && (
                        <NavAction
                            label={actions[0].label}
                            icon={actions[0].icon}
                            value={actions[0].value}
                            onClick={() => actions[0].action()}
                        />
                    )}

                    {disableNavbar && (
                        <NavAction
                            label={actions[4].label}
                            icon={actions[4].icon}
                            value={actions[4].value}
                            onClick={() => actions[4].action()}
                        />
                    )}
                </Stack>
            </Sheet>
            <DrawerList
                open={drawerOpen}
                closeDrawer={() => setDrawerOpen(false)}
                mainDirectories={mainDirectories}
            />
            <SearchModal
                open={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
            >
                <Search allowAdultContent={allowAdultContent} />
            </SearchModal>
        </Box>
    );
};

export default BottomNav;
