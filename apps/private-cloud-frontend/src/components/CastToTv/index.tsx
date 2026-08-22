"use client";

import { FC } from "react";
import IconButton from "@mui/joy/IconButton";
import CastIcon from "@mui/icons-material/Cast";
import Tooltip from "@mui/joy/Tooltip";
import { useCast, UseCastProps } from "./useCast";

export type CastToTvProps = UseCastProps;

const CastToTv: FC<CastToTvProps> = (props) => {
    const { castReady, casting, error, handleCast } = useCast(props);

    const canCast =
        !!props.videoSrc &&
        ((!props.subtitleSrc && !props.metadata) ||
            (!!props.subtitleSrc && !!props.metadata));

    return (
        <>
            {castReady && canCast && (
                <Tooltip
                    title="Transmitir a SmartTV / Chromecast"
                    variant="solid"
                >
                    <IconButton
                        disabled={!castReady || casting}
                        loading={casting}
                        onClick={handleCast}
                        sx={{ width: 36, height: 36 }}
                    >
                        <CastIcon sx={{ fontSize: 20, color: "white" }} />
                    </IconButton>
                </Tooltip>
            )}

            {error && (
                <span style={{ color: "red", marginLeft: 8 }}>{error}</span>
            )}
        </>
    );
};

export default CastToTv;
