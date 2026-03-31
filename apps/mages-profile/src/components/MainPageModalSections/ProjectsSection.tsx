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
                width: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                gap: "2%",
                pl: "11px",
                pr: isMobile ? 0 : "11px",
                pt: isMobile ? 0 : "11px",
                pb: "11px",
                overflowY: "hidden",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { width: "1%" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(127, 214, 255, 0.45)",
                    borderRadius: "999px",
                },
            }}
        >
            {projects.map((project, i) => (
                <ProjectListItem
                    key={project.component_id + "-" + i}
                    project={project}
                />
            ))}
        </Box>
    );
};

export default ProjectsSection;
