"use client";

import { FC } from "react";
import { Grid } from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import { getScreenSize } from "@/utils/screenSize";
import SubDirectoryCard from "../SubDirectoryCard";

export interface SubDirectoriesListProps {
    subDirectories: Directory[];
    hasEpisodes: boolean;
}

const SubDirectoriesList: FC<SubDirectoriesListProps> = ({
    subDirectories,
    hasEpisodes,
}) => {
    if (subDirectories.length === 0) {
        return null;
    }

    return (
        <Grid
            container
            spacing={2}
            component="section"
            sx={{
                marginBottom: hasEpisodes ? 3 : 0,
                display: "flex",
                justifyContent: "start",
                [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                    justifyContent: "center",
                },
            }}
        >
            {subDirectories.map((subDir, i) => (
                <SubDirectoryCard
                    key={`directory-page-sub-directories-list-${subDir.documentId}-${i}`}
                    directory={subDir}
                />
            ))}
        </Grid>
    );
};

export default SubDirectoriesList;
