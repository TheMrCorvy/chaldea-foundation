"use client";

import { Box, Option, Select, Typography } from "@mui/joy";
import { FC, useState } from "react";
import V2SecureVideoPlayer, {
    V2SecureVideoPlayerProps,
} from "../V2SecureVideoPlayer";
import V3SecureVideoPlayer from "../V3SecureVideoPlayer";

type PlayerVersion = "v2" | "v3";

const VideoPlayerSelector: FC<V2SecureVideoPlayerProps> = (props) => {
    const [playerVersion, setPlayerVersion] = useState<PlayerVersion>("v2");

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                }}
            >
                <Typography level="body-sm" fontWeight="md">
                    Reproductor:
                </Typography>
                <Select
                    value={playerVersion}
                    onChange={(_e, v) => v && setPlayerVersion(v)}
                    size="sm"
                    sx={{ minWidth: 220 }}
                    slotProps={{
                        listbox: { placement: "bottom-start" },
                    }}
                >
                    <Option value="v2">Estable (V2)</Option>
                    <Option value="v3">Experimental HLS (V3)</Option>
                </Select>
            </Box>

            {playerVersion === "v2" ? (
                <V2SecureVideoPlayer {...props} />
            ) : (
                <V3SecureVideoPlayer {...props} />
            )}
        </Box>
    );
};

export default VideoPlayerSelector;
