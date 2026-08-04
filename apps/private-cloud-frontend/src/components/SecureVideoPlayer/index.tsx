"use client";

import { ApiRoutes, NasApiRoutes } from "@/utils/routes";
import { Box, Card, CardContent, CardOverflow } from "@mui/joy";
import { FC, useMemo } from "react";
import { getScreenSize } from "@/utils/screenSize";
import PrevNextEpisode from "../PrevNextEpisode";
// import CastToTv from "../CastToTv";

export interface SecureVideoPlayerProps {
    fileType: string;
    display_name: string;
    path: string;
    documentId: string;
    useMockVideo?: boolean;
    parent: string;
    apiKey: string;
    nasBaseUrl: string;
    enableProxy?: boolean;
}

const SecureVideoPlayer: FC<SecureVideoPlayerProps> = ({
    fileType,
    display_name,
    path,
    documentId,
    useMockVideo = true,
    parent,
    apiKey,
    nasBaseUrl,
    enableProxy = false,
}) => {
    const filePath = path + "/" + display_name + "." + fileType;
    const realUrl = !enableProxy
        ? NasApiRoutes.STREAM_MEDIA
        : ApiRoutes.STREAM_EPISODE + "/" + documentId;
    const mockUrl = ApiRoutes.STREAM_EPISODE;
    let url: URL;

    if (useMockVideo) {
        url = new URL(mockUrl, window.location.origin);
    } else {
        if (!enableProxy) {
            url = new URL(realUrl, nasBaseUrl);
        } else {
            url = new URL(realUrl, window.location.origin);
        }
        url.searchParams.append("filePath", filePath);
        if (!enableProxy) {
            url.searchParams.append("apiKey", apiKey);
        }
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
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "end",
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
                    {/* <CastToTv videoSrc={videoUrl} /> */}
                    <PrevNextEpisode parentId={parent} episodeId={documentId} />
                </CardContent>
            </CardOverflow>
        </Card>
    );
};

export default SecureVideoPlayer;
