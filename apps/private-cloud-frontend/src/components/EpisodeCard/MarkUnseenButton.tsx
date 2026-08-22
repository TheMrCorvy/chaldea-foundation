"use client";

import { FC, useState } from "react";
import { CardOverflow, CircularProgress, Box } from "@mui/joy";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

import { logData } from "@repo/shared-utils/log-data";

interface MarkUnseenButtonProps {
    episodeId: string;
}

const MarkUnseenButton: FC<MarkUnseenButtonProps> = ({ episodeId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUnseen = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch(`/api/episodes/${episodeId}/unseen`, {
                method: "POST",
            });

            if (response.ok) {
                // Refresh the server component page to reflect the updated watched_by list
                router.refresh();
            }
        } catch (error) {
            logData({
                title: "Failed to mark as unseen",
                data: { error },
                layer: "*",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <Box
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(11, 107, 203, 0.4)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2000,
                        borderRadius: "var(--Card-radius)",
                        cursor: "not-allowed",
                    }}
                >
                    <CircularProgress
                        size="md"
                        variant="solid"
                        color="primary"
                    />
                </Box>
            )}
            <CardOverflow
                onClick={handleUnseen}
                data-testid="mark-unseen-button"
                sx={{
                    px: 0.5,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "#9c27b0",
                    color: "white",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    transition: "background-color 0.2s, opacity 0.2s",
                    "&:hover": {
                        backgroundColor: "#7b1fa2",
                    },
                }}
            >
                <VisibilityOffIcon
                    sx={{
                        fontSize: 20,
                        color: "white",
                    }}
                />
            </CardOverflow>
        </>
    );
};

export default MarkUnseenButton;
