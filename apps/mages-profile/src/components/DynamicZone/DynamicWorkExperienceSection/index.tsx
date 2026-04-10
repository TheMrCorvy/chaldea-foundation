"use client";

import { Box, Typography, Tooltip } from "@mui/material";
import { LayoutWorkExperienceSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import DynamicLink from "../DynamicLink";
import ExperienceListItem from "../../ExperienceListItem";

const DynamicWorkExperienceSection: FC<LayoutWorkExperienceSection> = ({
    title,
    experience_list_items,
    link_to_page,
    component_id,
}) => {
    return (
        <Box
            id={component_id}
            component={motion.section}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            sx={{
                width: "100%",
                maxWidth: "1500px",
                margin: "0 auto",
                py: { xs: 5, md: 8 },
                px: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                gap: 4,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    borderBottom: "1px solid rgba(56, 182, 255, 0.3)",
                    pb: 2,
                    gap: 2,
                }}
            >
                {title && (
                    <Typography
                        variant="h4"
                        sx={{
                            color: "rgba(178, 221, 255, 0.95)",
                            fontWeight: "bold",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {link_to_page && <DynamicLink {...link_to_page} />}
            </Box>

            {/* Experience List Items */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 4, md: 3 },
                }}
            >
                {experience_list_items?.map((experience, index) => {
                    const itemContent = (
                        <Box
                            key={experience.component_id || `exp-${index}`}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: "8px",
                                backgroundColor: "rgba(8, 20, 40, 0.4)",
                                border: "1px solid rgba(56, 182, 255, 0.15)",
                                boxShadow:
                                    "inset 0 0 10px rgba(56, 182, 255, 0.05)",
                                transition:
                                    "background-color 0.3s ease, border-color 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(11, 22, 40, 0.7)",
                                    borderColor: "rgba(56, 182, 255, 0.4)",
                                },
                            }}
                        >
                            <ExperienceListItem experience={experience} />
                        </Box>
                    );

                    if (experience.popover) {
                        return (
                            <Tooltip
                                key={
                                    experience.component_id ||
                                    `exp-tooltip-${index}`
                                }
                                title={experience.popover}
                                placement="top"
                                arrow
                            >
                                {itemContent}
                            </Tooltip>
                        );
                    }

                    return itemContent;
                })}
            </Box>
        </Box>
    );
};

export default DynamicWorkExperienceSection;
