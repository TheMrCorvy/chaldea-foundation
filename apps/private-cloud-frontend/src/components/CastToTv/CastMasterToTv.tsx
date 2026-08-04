"use client";

import { FC } from "react";
import IconButton from "@mui/joy/IconButton";
import CastIcon from "@mui/icons-material/Cast";
import Tooltip from "@mui/joy/Tooltip";
import { useCastMaster, UseCastMasterProps } from "./useCastMaster";

const CastMasterToTv: FC<UseCastMasterProps> = (props) => {
    const { castReady, casting, error, handleCast } = useCastMaster(props);

    return (
        <>
            <Tooltip
                title="Cast HLS Master (V3, legacy devices)"
                variant="solid"
            >
                <IconButton
                    disabled={!castReady || casting}
                    loading={casting}
                    onClick={handleCast}
                    sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: "#228B22",
                        "&:hover": { backgroundColor: "#1e7b1e" },
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

export default CastMasterToTv;
