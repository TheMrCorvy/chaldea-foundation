"use client";

import { themeConfig } from "@/lib/theme";
import { Button, Typography } from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import { FC } from "react";
import Grid from "@mui/joy/Grid";
import { redirect } from "next/navigation";
import { WebRoutes } from "@/utils/routes";

export interface MainCategoriesProps {
    directories: Directory[];
}

const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#2196f3",
    "#4caf50",
    "#ff9800",
];

const MainCategories: FC<MainCategoriesProps> = ({ directories }) => {
    return (
        <Grid container spacing={2} justifyContent="center">
            {directories.map((directory, i) => (
                <Grid key={directory.id} xs={12} md={6}>
                    <Button
                        key={directory.id}
                        onClick={() =>
                            redirect(
                                WebRoutes.DIRECTORY + "/" + directory.documentId
                            )
                        }
                        sx={{
                            width: "100%",
                            p: 1.5,
                            borderRadius: "md",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            minHeight: 80,
                            transition:
                                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                            "&:active": {
                                transform: "scale(0.98)",
                            },
                            backgroundColor: colors[i],
                            "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: colors[i],
                            },
                        }}
                        aria-label={`Votar por ${directory.display_name}`}
                    >
                        <Typography
                            level="title-md"
                            fontSize={24}
                            sx={{
                                color:
                                    themeConfig.colorSchemes?.dark?.palette
                                        ?.text?.primary || "white",
                                textTransform: "capitalize",
                            }}
                        >
                            {directory.display_name}
                        </Typography>
                    </Button>
                </Grid>
            ))}
        </Grid>
    );
};

export default MainCategories;
