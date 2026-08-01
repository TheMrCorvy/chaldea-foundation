"use client";

import { FC, useMemo, useState } from "react";
import { Grid } from "@mui/joy";
import { BlogPostCategory, Directory } from "@repo/type-definitions";
import { getScreenSize } from "@/utils/screenSize";
import SubDirectoryCard from "../SubDirectoryCard";
import V2SubDirectoryCard from "../V2SubDirectoryCard";
import TagFilterBar from "../TagFilterBar";

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
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const allTags = useMemo<BlogPostCategory[]>(() => {
        const seen = new Set<number>();
        const tags: BlogPostCategory[] = [];
        for (const dir of subDirectories) {
            for (const tag of dir.tags ?? []) {
                if (!seen.has(tag.id)) {
                    seen.add(tag.id);
                    tags.push(tag);
                }
            }
        }
        return tags;
    }, [subDirectories]);

    const handleTagToggle = (tagId: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const visibleDirectories = useMemo(() => {
        if (selectedTagIds.length === 0) return subDirectories;
        return subDirectories.filter((dir) =>
            selectedTagIds.every((tagId) =>
                dir.tags?.some((t) => t.id === tagId)
            )
        );
    }, [subDirectories, selectedTagIds]);

    if (subDirectories.length === 0) {
        return null;
    }

    return (
        <section>
            <TagFilterBar
                tags={allTags}
                selectedTagIds={selectedTagIds}
                onTagToggle={handleTagToggle}
                onClearAll={() => setSelectedTagIds([])}
            />
            <Grid
                container
                spacing={2}
                component="div"
                sx={{
                    marginBottom: hasEpisodes ? 3 : 0,
                    display: "flex",
                    justifyContent: "start",
                    [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                        justifyContent: "center",
                    },
                }}
            >
                {visibleDirectories.map((subDir, i) =>
                    subDir.cover || subDir.description ? (
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
        </section>
    );
};

export default SubDirectoriesList;
