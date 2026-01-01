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
import { FC, useCallback, useEffect, useState } from "react";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import { LoadingState } from "../DrawerList";
import useStyles from "./useStyles";

export interface DrawerEpisodesListProps {
    parentId: string;
}

const DrawerEpisodesList: FC<DrawerEpisodesListProps> = ({ parentId }) => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");

    const fetchEpisodes = useCallback(async () => {
        setLoadingState("loading");
        try {
            const response = await fetch(
                `/api/episodes/${encodeURIComponent(parentId)}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setLoadingState("succeeded");
            setEpisodes(data);
        } catch (error) {
            setLoadingState("failed");
            console.error("Error fetching episodes:", error);
        }
    }, [parentId]);

    useEffect(() => {
        if (parentId) {
            fetchEpisodes();
        }
    }, [parentId, fetchEpisodes]);

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
