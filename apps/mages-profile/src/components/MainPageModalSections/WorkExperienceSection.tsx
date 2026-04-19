import { LayoutWorkExperienceSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import ExperienceListItem from "../ExperienceListItem";
import { Box } from "@mui/material";

export interface WorkExperienceSectionProps {
    experience_list_items: LayoutWorkExperienceSection["experience_list_items"];
    component_id: string;
    isMobile?: boolean;
    color: LayoutWorkExperienceSection["color"];
}

const WorkExperienceSection: FC<WorkExperienceSectionProps> = ({
    experience_list_items,
    component_id,
    isMobile,
    color,
}) => {
    return (
        <Box
            component="section"
            id={"main-page-work-experience-section-" + component_id}
            sx={{
                height: "100%",
                position: "relative",
                paddingTop: "5px",
                paddingBottom: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "start",
                paddingRight: "11px",
                maxHeight: isMobile ? "65dvh" : "54dvh",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { width: "1%" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(127, 214, 255, 0.45)",
                    borderRadius: "999px",
                },
            }}
        >
            {experience_list_items.map((experienceItem, i) => (
                <ExperienceListItem
                    key={experienceItem.component_id + i}
                    experience={experienceItem}
                    isMobile={isMobile}
                    color={color}
                />
            ))}
        </Box>
    );
};

export default WorkExperienceSection;
