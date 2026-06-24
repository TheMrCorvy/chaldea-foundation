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
import { FC, useState } from "react";
import SearchBar from "../SearchBar";
import { LoadingState } from "../DrawerList";
import { SearchParams } from "../SearchBar";
import { Directory, PaginationObject } from "@repo/type-definitions";
import { WebRoutes } from "@/utils/routes";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { logData } from "@repo/shared-utils/log-data";
import ErrorIcon from "@mui/icons-material/Error";

interface SearchProps {
    allowAdultContent?: boolean;
    autoFocus?: boolean;
}

const Search: FC<SearchProps> = ({ allowAdultContent, autoFocus }) => {
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");
    const [directoriesResponse, setDirectoriesResponse] = useState<Directory[]>(
        []
    );
    const [pagination, setPagination] = useState<PaginationObject>({
        page: 1,
        pageCount: 1,
        pageSize: 100,
        total: 0,
    });

    const handlesearch = async (searchParams: SearchParams) => {
        setLoadingState("loading");
        try {
            const response = await fetch("/api/get-directories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: searchParams.query,
                    allowAdultContent: searchParams.switchAdult,
                    onlySearchAdultContent: searchParams.switchOnlyAdult,
                    page: searchParams.page,
                    pageSize: 50,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setDirectoriesResponse(data.result.data);
            setLoadingState("succeeded");
            setPagination(data.result.meta.pagination);
        } catch (error) {
            logData({
                title: "Error loading the search term",
                type: "error",
                layer: "*",
                data: error,
                addSpaceAfter: true,
                addSeparatorAfter: true,
                timeStamp: true,
            });
            setLoadingState("failed");
        }
    };

    return (
        <>
            <SearchBar
                allowAdultContent={allowAdultContent}
                handleSubmit={handlesearch}
                pagination={pagination}
                autoFocus={autoFocus}
            />
            {loadingState === "loading" && (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 2,
                    }}
                >
                    <CircularProgress variant="plain" />
                </Box>
            )}
            {loadingState === "failed" && (
                <Box
                    sx={{
                        width: "100%",
                        textAlign: "center",
                        color: "error.500",
                        marginTop: 2,
                    }}
                >
                    Error al realizar la búsqueda. Por favor, inténtelo de
                    nuevo.
                </Box>
            )}
            {loadingState === "succeeded" &&
                directoriesResponse.length !== 0 && (
                    <List
                        sx={{
                            "--ListItem-paddingY": "8px",
                            width: {
                                xs: "100%",
                                sm: "12rem",
                                md: "30rem",
                                lg: "35rem",
                                xl: "40rem",
                            },
                            paddingTop: 0.5,
                        }}
                    >
                        {directoriesResponse.map((directory) => (
                            <ListItem
                                key={
                                    "drawer-list-main-dir-" +
                                    directory.documentId
                                }
                            >
                                <ListItemButton
                                    href={
                                        WebRoutes.DIRECTORY +
                                        "/" +
                                        directory.documentId
                                    }
                                    component="a"
                                    variant="plain"
                                    sx={{
                                        borderRadius: "sm",
                                        "&:hover": {
                                            backgroundColor:
                                                "#0B6BCB !important",
                                            color: "white !important",
                                        },
                                    }}
                                >
                                    <ListItemDecorator>
                                        <DriveFileMoveIcon />
                                    </ListItemDecorator>
                                    <ListItemContent
                                        sx={{
                                            color: "white",
                                        }}
                                    >
                                        {directory.display_name}
                                    </ListItemContent>
                                    {directory.adult && (
                                        <ListItemDecorator>
                                            <ErrorIcon />
                                        </ListItemDecorator>
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            {loadingState === "succeeded" &&
                directoriesResponse.length === 0 && (
                    <Box
                        sx={{
                            width: "100%",
                            textAlign: "center",
                            color: "text.secondary",
                            marginTop: 3.5,
                            marginBottom: 2,
                        }}
                    >
                        <Typography level="body-lg" sx={{ color: "white" }}>
                            No se encontraron resultados para la búsqueda
                            realizada.
                        </Typography>
                    </Box>
                )}
        </>
    );
};

export default Search;
