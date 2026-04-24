"use client";

import { Box, Grid } from "@mui/material";
import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicTitle from "../DynamicTitle";
import ProjectItem from "./ProjectItem";

export interface DynamicProjectsSection extends SectionsProjectsSection {
    isMobile?: boolean | null;
    imageBaseUrl: string;
}

const DynamicProjectsSection: FC<DynamicProjectsSection> = ({
    title,
    title_color,
    link_to_page,
    projects,
    component_id,
    id,
    imageBaseUrl,
    isMobile,
}) => {
    return (
        <Box
            id={component_id}
            component="section"
            sx={{
                width: "100%",
                maxWidth: "1500px",
                margin: "0 auto",
                py: { xs: 6, md: 10 },
                px: { xs: 2, sm: 4, lg: 6 },
            }}
        >
            {title && (
                <DynamicTitle
                    title={title}
                    color={title_color || "#eeeeee"}
                    size="h4"
                    isMobile={isMobile || false}
                    text_align="left"
                    id={id}
                    link_to_page={link_to_page}
                />
            )}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: { xs: 4, lg: 5 },
                    pt: 6,
                }}
            >
                {projects?.map((project, index) => (
                    <ProjectItem
                        imageBaseUrl={imageBaseUrl}
                        key={project.component_id || `project-${index}`}
                        project={project}
                        isMobile={isMobile || false}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default DynamicProjectsSection;
