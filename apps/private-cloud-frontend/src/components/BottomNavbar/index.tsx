"use client";

import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { CSSProperties, FC } from "react";
import DrawerList from "../DrawerList";
import NavAction from "../NavAction/index";
import useStyles from "./useStyles";
import { Box } from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import SearchModal from "../SearchModal";
import Search from "../Search";
import useNavActions from "./useNavActions";

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
    const {
        actions,
        drawerOpen,
        setDrawerOpen,
        searchModalOpen,
        setSearchModalOpen,
    } = useNavActions();

    const { root, sheet } = useStyles();

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
