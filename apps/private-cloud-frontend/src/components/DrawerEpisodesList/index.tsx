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
                            sx={{
                                borderRadius: "sm",
                                "&:hover": {
                                    backgroundColor: "#0B6BCB !important",
                                    color: "white !important",
                                },
                            }}
                        >
                            <ListItemDecorator>
                                <NotStartedIcon />
                            </ListItemDecorator>
                            <ListItemContent
                                sx={{
                                    color: "white",
                                }}
                            >
                                {episode.display_name}
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                ))}
            {loadingState === "loading" && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <CircularProgress variant="plain" />
                </Box>
            )}
            {loadingState === "failed" && (
                <Typography
                    level="body-md"
                    color="danger"
                    sx={{
                        paddingLeft: 2,
                        marginTop: 3,
                    }}
                >
                    Error loading episodes. Please try again later.
                </Typography>
            )}
            {loadingState === "succeeded" && episodes.length === 0 && (
                <Typography
                    level="body-md"
                    color="neutral"
                    sx={{
                        paddingLeft: 2,
                        marginTop: 3,
                    }}
                >
                    Esta categoria aún no tiene nada disponible.
                </Typography>
            )}
        </List>
    );
};

export default DrawerEpisodesList;
