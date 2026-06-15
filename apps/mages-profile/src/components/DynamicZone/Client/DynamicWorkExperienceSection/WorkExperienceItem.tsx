import { FC } from "react";
import { Tooltip, Grid } from "@mui/material";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import { motion } from "framer-motion";
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
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ flex: 1, width: "100%" }}
            >
                <WorkExperienceItemContent experience={experience} />
            </motion.div>
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
