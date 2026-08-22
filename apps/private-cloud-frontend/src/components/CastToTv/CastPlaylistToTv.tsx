"use client";

import { FC } from "react";
import IconButton from "@mui/joy/IconButton";
import CastIcon from "@mui/icons-material/Cast";
import Tooltip from "@mui/joy/Tooltip";
import { useCastPlaylist, UseCastPlaylistProps } from "./useCastPlaylist";

const CastPlaylistToTv: FC<UseCastPlaylistProps> = (props) => {
    const { castReady, casting, error, handleCast } = useCastPlaylist(props);

    return (
        <>
            <Tooltip title="Cast HLS Playlist (V3)" variant="solid">
                <IconButton
                    disabled={!castReady || casting}
                    loading={casting}
                    onClick={handleCast}
                    sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: "#0B6BCB",
                        "&:hover": { backgroundColor: "#0258A5" },
                    }}
                >
                    <CastIcon sx={{ fontSize: 20, color: "white" }} />
                </IconButton>
            </Tooltip>

            {error && (
                <span style={{ color: "red", marginLeft: 8 }}>{error}</span>
            )}
        </>
    );
};

export default CastPlaylistToTv;
