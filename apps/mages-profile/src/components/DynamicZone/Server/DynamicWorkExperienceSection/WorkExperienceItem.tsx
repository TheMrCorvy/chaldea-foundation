import { FC } from "react";
import { Box, Tooltip, Grid } from "@mui/material";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import WorkExperienceItemContent from "../../Shared/WorkExperienceItemContent";

export interface WorkExperienceItemProps {
    experience: LayoutWorkExperienceListItem;
}

const WorkExperienceItem: FC<WorkExperienceItemProps> = ({ experience }) => {
    const itemContent = (
        <Grid
            size={{
                sm: 12,
                md: 6,
            }}
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ flex: 1, width: "100%" }}>
                <WorkExperienceItemContent experience={experience} />
            </Box>
        </Grid>
    );

    if (experience.popover) {
        return (
            <Tooltip title={experience.popover} placement="top" arrow>
                {itemContent}
            </Tooltip>
        );
    }

    return itemContent;
};

export default WorkExperienceItem;
