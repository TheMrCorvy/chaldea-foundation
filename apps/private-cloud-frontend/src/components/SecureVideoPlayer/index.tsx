"use client";

import { ApiRoutes, NasApiRoutes } from "@/utils/routes";
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
import { VideoContainers } from "@repo/type-definitions";
import { FC, useMemo } from "react";
import { getScreenSize } from "@/utils/screenSize";
import PrevNextEpisode from "../PrevNextEpisode";

export interface SecureVideoPlayerProps {
    fileType: VideoContainers;
    display_name: string;
    path: string;
    languages_info?: object | null;
    documentId: string;
    useMockVideo?: boolean;
    parent: string;
    fileId: string;
    nasBaseUrl: string;
}

const SecureVideoPlayer: FC<SecureVideoPlayerProps> = ({
    fileType,
    display_name,
    path,
    languages_info,
    documentId,
    useMockVideo = true,
    parent,
    fileId,
    nasBaseUrl,
}) => {
    const filePath = path + "/" + display_name + "." + fileType;
    const realUrl = NasApiRoutes.STREAM_MEDIA;
    const mockUrl = ApiRoutes.STREAM_EPISODE;
    let url: URL;

    if (useMockVideo) {
        url = new URL(mockUrl, window.location.origin);
    } else {
        url = new URL(realUrl, nasBaseUrl);
        url.searchParams.append("filePath", filePath);
        url.searchParams.append("apiKey", fileId);

        console.log(fileId);
    }

    const videoUrl = useMemo(() => {
        return url.toString();
    }, [url]);

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
                        src={videoUrl}
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

export default SecureVideoPlayer;
