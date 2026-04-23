"use client";

import { LayoutWorkExperienceSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicTitle from "../DynamicTitle";
import { Box, Grid } from "@mui/material";
import WorkExperienceItem from "./WorkExperienceItem";

export interface DynamicWorkExperienceSectionProps extends LayoutWorkExperienceSection {
    isMobile?: boolean;
}

const DynamicWorkExperienceSection: FC<DynamicWorkExperienceSectionProps> = ({
    title,
    experience_list_items,
    link_to_page,
    component_id,
    color,
    isMobile,
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
                    isMobile={isMobile}
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
                    alignItems: "flex-start",
                }}
            >
                {experience_list_items?.map((experience, index) => (
                    <WorkExperienceItem
                        key={experience.component_id || `exp-${index}`}
                        experience={experience}
                        isMobile={isMobile}
                    />
                ))}
            </Grid>
        </Box>
    );
};

export default DynamicWorkExperienceSection;
