"use client";

import { useMemo } from "react";
import { NasApiRoutes } from "@/utils/routes";

interface SecureVideoPlayerProps {
    apiKey: string;
    filePath: string;
    baseUrl: string;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
    apiKey,
    filePath,
    baseUrl,
}) => {
    // Build a streaming URL with query params instead of fetching the entire file
    const videoUrl = useMemo(() => {
        const url = new URL(baseUrl + NasApiRoutes.serveAnimeEpisode);
        url.searchParams.append("filePath", filePath);
        url.searchParams.append("apiKey", apiKey);
        return url.toString();
    }, [apiKey, filePath, baseUrl]);

    return (
        <div>
            <video
                controls
                width="800"
                style={{ maxWidth: "100%" }}
                src={videoUrl}
                preload="metadata"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default SecureVideoPlayer;
