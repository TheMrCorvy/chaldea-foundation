"use client";

import { FC, useState } from "react";
import CardOverflow from "@mui/joy/CardOverflow";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

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
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to mark as unseen", error);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    // transform: "rotate(90deg)",
                    color: "white",
                }}
            />
        </CardOverflow>
    );
};

export default MarkUnseenButton;
