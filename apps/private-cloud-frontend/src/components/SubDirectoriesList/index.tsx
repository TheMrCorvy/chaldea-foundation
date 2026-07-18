"use client";

import { FC } from "react";
import { Grid } from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import { getScreenSize } from "@/utils/screenSize";
import SubDirectoryCard from "../SubDirectoryCard";
import V2SubDirectoryCard from "../V2SubDirectoryCard";

export interface SubDirectoriesListProps {
    subDirectories: Directory[];
    hasEpisodes: boolean;
    imageBaseUrl: string;
}

const SubDirectoriesList: FC<SubDirectoriesListProps> = ({
    subDirectories,
    hasEpisodes,
    imageBaseUrl,
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
            {subDirectories.map((subDir, i) =>
                subDir.cover ||
                (subDir.tags && subDir.tags.length > 0) ||
                subDir.description ? (
                    <V2SubDirectoryCard
                        key={`directory-page-sub-directories-list-${subDir.documentId}-${i}`}
                        directory={subDir}
                        imageBaseUrl={imageBaseUrl}
                    />
                ) : (
                    <SubDirectoryCard
                        key={`directory-page-sub-directories-list-${subDir.documentId}-${i}`}
                        directory={subDir}
                    />
                )
            )}
        </Grid>
    );
};

export default SubDirectoriesList;
