import { WebRoutes } from "@/utils/routes";
import {
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    Typography,
} from "@mui/joy";
import { Episode } from "@repo/type-definitions";
import { FC, useEffect, useState } from "react";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import { LoadingState } from "../DrawerList";
import useStyles from "./useStyles";

import { logData } from "@repo/shared-utils/log-data";

export interface DrawerEpisodesListProps {
    parentId: string;
}

const DrawerEpisodesList: FC<DrawerEpisodesListProps> = ({ parentId }) => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>(
        parentId ? "loading" : "idle"
    );

    useEffect(() => {
        if (!parentId) return;

        let isMounted = true;

        fetch(`/api/episodes/${encodeURIComponent(parentId)}`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (isMounted) {
                    setLoadingState("succeeded");
                    setEpisodes(data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    setLoadingState("failed");
                    logData({
                        title: "Error fetching episodes",
                        data: { error },
                        layer: "*",
                        type: "error",
                    });
                }
            });

        return () => {
            isMounted = false;
        };
    }, [parentId]);

    const { listItemButton, colorWhite, loader, errorLoading, emptyPage } =
        useStyles();

    return (
        <List
            sx={{
                "--ListItem-paddingY": "8px",
                marginTop: "10px",
            }}
        >
            {loadingState === "succeeded" &&
                episodes.map((episode) => (
                    <ListItem
                        key={"drawer-list-main-dir-" + episode.documentId}
                    >
                        <ListItemButton
                            href={WebRoutes.EPISODE + "/" + episode.documentId}
                            component="a"
                            variant="plain"
                            sx={listItemButton}
                        >
                            <ListItemDecorator>
                                <NotStartedIcon />
                            </ListItemDecorator>
                            <ListItemContent sx={colorWhite}>
                                {episode.display_name}
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                ))}
            {loadingState === "loading" && (
                <Box sx={loader}>
                    <CircularProgress variant="plain" />
                </Box>
            )}
            {loadingState === "failed" && (
                <Typography level="body-md" color="danger" sx={errorLoading}>
                    Error loading episodes. Please try again later.
                </Typography>
            )}
            {loadingState === "succeeded" && episodes.length === 0 && (
                <Typography level="body-md" color="neutral" sx={emptyPage}>
                    Esta categoria aún no tiene nada disponible.
                </Typography>
            )}
        </List>
    );
};

export default DrawerEpisodesList;
