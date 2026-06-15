import { Box, Grid } from "@mui/material";
import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicTitle from "../../Shared/DynamicTitle";
import ProjectItem from "./ProjectItem";

export interface DynamicProjectsSection extends SectionsProjectsSection {
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
                    text_align="left"
                    id={id}
                    link_to_page={link_to_page}
                />
            )}

            <Grid
                container
                spacing={{ xs: 4, lg: 5 }}
                justifyContent="center"
                sx={{ pt: 6 }}
            >
                {projects?.map((project, index) => (
                    <Grid
                        key={project.component_id || `project-${index}`}
                        size={{ xs: 12, sm: 6, lg: 4 }}
                    >
                        <ProjectItem
                            imageBaseUrl={imageBaseUrl}
                            project={project}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DynamicProjectsSection;
