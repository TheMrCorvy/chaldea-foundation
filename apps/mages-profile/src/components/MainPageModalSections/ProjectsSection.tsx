import { Box } from "@mui/material";
import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import ProjectListItem from "../ProjectListItem";

const ProjectsSection: FC<SectionsProjectsSection> = ({
    projects,
    component_id,
}) => {
    return (
        <Box
            component="section"
            id={"main-page-projects-section-" + component_id}
            sx={{
                height: "100%",
                position: "relative",
                py: "2%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                gap: "2%",
                overflowY: "auto",
                pr: "1%",
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
