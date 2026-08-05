"use client";

import { FC } from "react";
import { Box, Chip, Typography } from "@mui/joy";
import { BlogPostCategory } from "@repo/type-definitions";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface TagFilterBarProps {
    tags: BlogPostCategory[];
}

const TagFilterBar: FC<TagFilterBarProps> = ({ tags }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedTagNames = searchParams.getAll("tags");

    if (tags.length === 0) return null;

    const handleTagToggle = (tagName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("tags");
        const isSelected = selectedTagNames.includes(tagName);
        const newTags = isSelected
            ? selectedTagNames.filter((n) => n !== tagName)
            : [...selectedTagNames, tagName];
        newTags.forEach((n) => params.append("tags", n));
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("tags");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                px: 1,
                py: 1.5,
                mb: 2,
                borderRadius: "12px",
                backgroundColor: "#0B6BCB10",
                border: "1px solid #0B6BCB30",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#7EB3E8",
                    flexShrink: 0,
                    mr: 0.5,
                }}
            >
                <FilterAltIcon sx={{ fontSize: 18 }} />
                <Typography
                    level="body-xs"
                    sx={{
                        color: "#7EB3E8",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                    }}
                >
                    Filtrar
                </Typography>
            </Box>

            {tags.map((tag) => {
                const isSelected = selectedTagNames.includes(tag.name);
                return (
                    <Chip
                        key={tag.id}
                        color={isSelected ? "primary" : "success"}
                        size="md"
                        variant={isSelected ? "solid" : "soft"}
                        onClick={() => handleTagToggle(tag.name)}
                        sx={{
                            cursor: "pointer",
                            textTransform: "capitalize",
                            transition:
                                "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
                        }}
                    >
                        {tag.name}
                    </Chip>
                );
            })}

            {selectedTagNames.length > 0 && (
                <Chip
                    size="md"
                    variant="outlined"
                    onClick={handleClearAll}
                    sx={{
                        cursor: "pointer",
                        ml: "auto",
                        mt: 3,
                        borderColor: "#0B6BCB50",
                        color: "#7EB3E8",
                        transition: "all 0.18s ease",
                        "&:hover": {
                            borderColor: "#0B6BCB",
                            color: "#fff",
                            backgroundColor: "#0B6BCB20",
                        },
                    }}
                >
                    Limpiar
                </Chip>
            )}
        </Box>
    );
};

export default TagFilterBar;
