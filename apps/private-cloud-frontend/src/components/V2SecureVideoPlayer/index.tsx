"use client";

import { NasApiRoutes } from "@/utils/routes";
import {
    Box,
    Card,
    CardContent,
    CardOverflow,
    Option,
    Select,
    Stack,
    Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { getScreenSize } from "@/utils/screenSize";
import PrevNextEpisode from "../PrevNextEpisode";
import { LanguagesInfo } from "@repo/type-definitions";

export interface V2SecureVideoPlayerProps {
    fileType: string;
    display_name: string;
    path: string;
    languages_info: LanguagesInfo;
    documentId: string;
    parent: string;
    apiKey: string;
    nasBaseUrl: string;
    // enableProxy?: boolean;
}

const V2SecureVideoPlayer: FC<V2SecureVideoPlayerProps> = ({
    fileType,
    display_name,
    path,
    languages_info,
    documentId,
    parent,
    apiKey,
    nasBaseUrl,
    // enableProxy = false,
}) => {
    const [start, setStart] = useState(0);
    const [audioIndex, setAudioIndex] = useState(0);

    const videoSrc = `${nasBaseUrl}${NasApiRoutes.V2_STREAM_MEDIA}/${fileType}?start=${start}&parentDirectory=${path}&fileName=${display_name}&apiKey=${apiKey}&audioIndex=${audioIndex}`;

    return (
        <Card
            variant="soft"
            sx={{
                background: "neutral.900",
                borderRadius: 20,
                "--Card-padding": {
                    xs: "8px",
                    md: "16px",
                },
                "--Card-radius": "20px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            }}
        >
            <CardContent
                sx={{
                    gap: 1,
                    pb: 1,
                    zIndex: 0,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        backgroundColor: "#000",
                        border: "1px solid",
                        borderColor: "neutral.200",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                >
                    <video
                        controls
                        width="800"
                        style={{
                            width: "100%",
                            display: "block",
                            aspectRatio: "16/9",
                        }}
                        src={videoSrc}
                        preload="auto"
                    >
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                </Box>
            </CardContent>
            <CardOverflow
                variant="solid"
                sx={{
                    backgroundColor: "#0B6BCB",
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        py: 2,
                        gap: 2,
                        zIndex: 0,
                        [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                            flexDirection: "column",
                            gap: 3,
                        },
                    }}
                >
                    {languages_info && (
                        <Stack
                            direction="row"
                            spacing={1.5}
                            sx={{
                                [`@media (max-width: ${getScreenSize("xl")}px)`]:
                                    {
                                        width: "100%",
                                        justifyContent: "center",
                                    },
                            }}
                        >
                            <Box sx={{ minWidth: 100 }}>
                                <Typography
                                    level="body-xs"
                                    fontWeight="bold"
                                    sx={{
                                        textAlign: "left",
                                        mb: 0.5,
                                        color: "white",
                                        paddingLeft: 0.5,
                                    }}
                                >
                                    Idioma
                                </Typography>
                                <Select
                                    defaultValue="SPA"
                                    slotProps={{
                                        listbox: {
                                            placement: "bottom-start",
                                            sx: { minWidth: 160 },
                                        },
                                    }}
                                    variant="soft"
                                    size="sm"
                                >
                                    <Option value="ENG">ENG</Option>
                                    <Option value="JAP">JAP</Option>
                                    <Option value="SPA">SPA</Option>
                                </Select>
                            </Box>
                            <Box sx={{ minWidth: 100 }}>
                                <Typography
                                    level="body-xs"
                                    fontWeight="bold"
                                    sx={{
                                        textAlign: "left",
                                        mb: 0.5,
                                        color: "white",
                                        paddingLeft: 0.5,
                                    }}
                                >
                                    Subtítulos
                                </Typography>
                                <Select
                                    defaultValue="SPA"
                                    slotProps={{
                                        listbox: {
                                            placement: "bottom-start",
                                            sx: { minWidth: 160 },
                                        },
                                    }}
                                    variant="soft"
                                    size="sm"
                                >
                                    <Option value="ENG">ENG</Option>
                                    <Option value="JAP">JAP</Option>
                                    <Option value="SPA">SPA</Option>
                                </Select>
                            </Box>
                        </Stack>
                    )}

                    <PrevNextEpisode parentId={parent} episodeId={documentId} />
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default V2SecureVideoPlayer;
