import { WebRoutes } from "@/utils/routes";
import { getScreenSize } from "@/utils/screenSize";
import { ButtonGroup, IconButton, Skeleton } from "@mui/joy";
import { FC, useCallback, useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FolderIcon from "@mui/icons-material/Folder";
import { LoadingState } from "../DrawerList";
import { Episode } from "@repo/type-definitions";

export interface PrevNextEpisodeProps {
    parentId: string;
    episodeId: string;
}

const PrevNextEpisode: FC<PrevNextEpisodeProps> = ({ parentId, episodeId }) => {
    const [loadingState, setLoadingState] = useState<LoadingState>("loading");
    const [episodes, setEpisodes] = useState<{
        prev: string | null;
        next: string | null;
    }>({ prev: null, next: null });

    const getPrevNext = useCallback(
        (episodes: Episode[]) => {
            const currentEpIndex = episodes.findIndex(
                (ep) => ep.documentId === episodeId
            );
            const prevEp =
                currentEpIndex > 0 ? episodes[currentEpIndex - 1] : null;
            const nextEp =
                currentEpIndex < episodes.length - 1
                    ? episodes[currentEpIndex + 1]
                    : null;

            setEpisodes({
                prev: prevEp ? prevEp.documentId : null,
                next: nextEp ? nextEp.documentId : null,
            });
        },
        [episodeId]
    );

    useEffect(() => {
        const getDirectories = async () => {
            const response = await fetch(`/api/episodes/${parentId}`);
            if (response.ok) {
                const data = await response.json();
                getPrevNext(data);
                setLoadingState("succeeded");
            } else {
                setLoadingState("failed");
            }
        };

        getDirectories();
    }, [parentId, getPrevNext]);

    if (loadingState === "loading") {
        return <Skeleton variant="rectangular" width={350} height={30} />;
    }

    if (loadingState === "failed") {
        return null;
    }

    return (
        <ButtonGroup
            variant="solid"
            aria-label="navigation buttons"
            color="neutral"
            sx={{
                height: 35,
                width: 350,
                [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                    width: 215,
                    maxHeight: 30,
                },
            }}
        >
            {episodes.prev && (
                <IconButton
                    sx={{
                        flex: 1,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                    }}
                    component="a"
                    href={WebRoutes.EPISODE + "/" + episodes.prev}
                >
                    <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>
            )}
            <IconButton
                sx={{
                    flex: 1,
                }}
                component="a"
                href={WebRoutes.DIRECTORY + "/" + parentId}
            >
                <FolderIcon fontSize="small" />
            </IconButton>
            {episodes.next && (
                <IconButton
                    sx={{
                        flex: 1,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                    }}
                    component="a"
                    href={WebRoutes.EPISODE + "/" + episodes.next}
                >
                    <ArrowForwardIosIcon fontSize="small" />
                </IconButton>
            )}
        </ButtonGroup>
    );
};

export default PrevNextEpisode;
