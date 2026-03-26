import { Box } from "@mui/material";
import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import ProjectListItem from "../ProjectListItem";

export interface ProjectsSectionProps extends SectionsProjectsSection {
    isMobile?: boolean;
}

const ProjectsSection: FC<ProjectsSectionProps> = ({
    projects,
    component_id,
    isMobile,
}) => {
    return (
        <Box
            component="section"
            id={"main-page-projects-section-" + component_id}
            sx={{
                height: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                gap: "2%",
                p: 1,
            }}
        >
            {projects.map((project, i) => (
                <ProjectListItem
                    key={project.component_id + "-" + i}
                    project={project}
                    isMobile={isMobile}
                />
            ))}
        </Box>
    );
};

export default ProjectsSection;
