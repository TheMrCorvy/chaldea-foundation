import { LayoutWorkExperienceSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicTitle from "../../Shared/DynamicTitle";
import { Box, Grid } from "@mui/material";
import WorkExperienceItem from "./WorkExperienceItem";

const DynamicWorkExperienceSection: FC<LayoutWorkExperienceSection> = ({
    title,
    experience_list_items,
    link_to_page,
    component_id,
    color,
    id,
}) => {
    return (
        <Box
            id={component_id}
            component="section"
            sx={{
                width: "100%",
                maxWidth: "1300px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 5,
            }}
        >
            {title && (
                <DynamicTitle
                    title={title}
                    color={color || "#eeeeee"}
                    size="h4"
                    link_to_page={link_to_page}
                    text_align="left"
                    id={id}
                />
            )}

            <Grid
                container
                spacing={8}
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {experience_list_items?.map((experience, index) => (
                    <WorkExperienceItem
                        key={experience.component_id || `exp-${index}`}
                        experience={experience}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default DynamicWorkExperienceSection;
