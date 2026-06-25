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
import { LoadingState } from "../DrawerList";
import { KeyboardArrowDown } from "@mui/icons-material";
import { WebRoutes } from "@/utils/routes";
import { GroupedDirectories } from "@/utils/directories";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import CategoryIcon from "@mui/icons-material/Category";
import DrawerEpisodesList from "../DrawerEpisodesList";
import ErrorIcon from "@mui/icons-material/Error";
import NoAdultContentIcon from "@mui/icons-material/NoAdultContent";

export interface DrawerListContentProps {
    directories?: GroupedDirectories;
    loadingState: LoadingState;
    parentId: string;
}

const DrawerListContent: FC<DrawerListContentProps> = ({
    directories,
    loadingState,
    parentId,
}) => {
    const groupedDirectories = Object.entries(directories || {});
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        {}
    );

    const toggleSection = (letter: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [letter]: !prev[letter],
        }));
    };

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                overflowY: "auto",
                paddingRight: 2,
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#0A1220",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#4A607E",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#5A7394",
                    },
                },
            }}
        >
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
            {loadingState === "succeeded" &&
                directories &&
                groupedDirectories.length !== 0 && (
                    <List
                        size="sm"
                        sx={{
                            width: "100%",
                            "--ListItem-paddingY": "4px",
                            "--ListItem-paddingRight": "16px",
                            "--ListItem-paddingLeft": "16px",
                        }}
                    >
                        {groupedDirectories.map(
                            ([letter, directoriesArray]) => (
                                <ListItem
                                    key={`drawer-list-section-${letter}`}
                                    nested
                                    sx={{ my: 1 }}
                                >
                                    <ListItemButton
                                        onClick={() => toggleSection(letter)}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            borderRadius: "sm",
                                            color: "white",
                                            "&:hover": {
                                                backgroundColor:
                                                    "#0B6BCB !important",
                                                color: "white !important",
                                            },
                                        }}
                                    >
                                        <ListItemContent
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                alignItems: "center",
                                            }}
                                        >
                                            <ListItemDecorator>
                                                <CategoryIcon />
                                            </ListItemDecorator>
                                            <Typography
                                                level="title-md"
                                                sx={[
                                                    openSections[letter]
                                                        ? {
                                                              fontWeight:
                                                                  "bold",
                                                              color: "text.primary",
                                                          }
                                                        : {
                                                              fontWeight: null,
                                                              color: "inherit",
                                                          },
                                                ]}
                                                fontWeight="bold"
                                            >
                                                {letter.toUpperCase()}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                level="body-sm"
                                            >
                                                {directoriesArray.length}
                                            </Typography>
                                        </ListItemContent>
                                        <KeyboardArrowDown
                                            sx={[
                                                openSections[letter]
                                                    ? {
                                                          transform: "initial",
                                                      }
                                                    : {
                                                          transform:
                                                              "rotate(-90deg)",
                                                      },
                                            ]}
                                        />
                                    </ListItemButton>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            paddingLeft: "12px",
                                        }}
                                    >
                                        {openSections[letter] && (
                                            <List
                                                sx={{
                                                    "--ListItem-paddingY":
                                                        "8px",
                                                    marginTop: "10px",
                                                }}
                                            >
                                                {directoriesArray.map(
                                                    (directory) => (
                                                        <ListItem
                                                            key={
                                                                "drawer-list-main-dir-" +
                                                                directory.url
                                                            }
                                                        >
                                                            <ListItemButton
                                                                href={
                                                                    WebRoutes.DIRECTORY +
                                                                    "/" +
                                                                    directory.url
                                                                }
                                                                component="a"
                                                                variant="plain"
                                                                sx={{
                                                                    borderRadius:
                                                                        "sm",
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
                                                                    {
                                                                        directory.label
                                                                    }
                                                                </ListItemContent>
                                                                {directory.age_rating ===
                                                                    "explicit" && (
                                                                    <ListItemDecorator>
                                                                        <ErrorIcon />
                                                                    </ListItemDecorator>
                                                                )}
                                                                {directory.age_rating ===
                                                                    "adults" && (
                                                                    <ListItemDecorator>
                                                                        <NoAdultContentIcon />
                                                                    </ListItemDecorator>
                                                                )}
                                                            </ListItemButton>
                                                        </ListItem>
                                                    )
                                                )}
                                            </List>
                                        )}
                                    </Box>
                                </ListItem>
                            )
                        )}
                    </List>
                )}
            {loadingState === "succeeded" &&
                groupedDirectories.length === 0 && (
                    <Box
                        component="section"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            width: "100%",
                            overflowY: "auto",
                            paddingRight: 2,
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#0A1220",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#4A607E",
                                borderRadius: "4px",
                                "&:hover": {
                                    backgroundColor: "#5A7394",
                                },
                            },
                        }}
                    >
                        <DrawerEpisodesList parentId={parentId} />
                    </Box>
                )}
            {loadingState === "failed" && (
                <Box
                    component="section"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Typography level="body-md" color="danger">
                        Algo salió mal al cargar los directorios. Contáctate con
                        el administrador de la página.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default DrawerListContent;
