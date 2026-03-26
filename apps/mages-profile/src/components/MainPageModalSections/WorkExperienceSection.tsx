import { LayoutWorkExperienceSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import ExperienceListItem from "../ExperienceListItem";

const WorkExperienceSection: FC<LayoutWorkExperienceSection> = ({
    experience_list_items,
    component_id,
}) => {
    return (
        <section
            id={"main-page-work-experience-section-" + component_id}
            style={{
                height: "100%",
                position: "relative",
                paddingTop: "5px",
                paddingBottom: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "start",
                paddingRight: "11px",
            }}
        >
            {experience_list_items.map((experienceItem, i) => (
                <ExperienceListItem
                    key={experienceItem.component_id + i}
                    experience={experienceItem}
                />
            ))}
        </section>
    );
};

export default WorkExperienceSection;
