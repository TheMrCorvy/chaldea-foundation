"use client";

import { Box } from "@mui/material";
import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { motion } from "framer-motion";
import DynamicTitle from "../DynamicTitle";
import ProjectItem from "./ProjectItem";
import PixelCard from "@/components/PixelCard";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
        filter: "blur(0px)",
    },
};

export interface DynamicProjectsSection extends SectionsProjectsSection {
    isMobile?: boolean | null;
}

const DynamicProjectsSection: FC<DynamicProjectsSection> = ({
    title,
    title_color,
    link_to_page,
    projects,
    component_id,
    id,
    isMobile = false,
}) => {
    return (
        <Box
            id={component_id}
            component={motion.section}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            variants={containerVariants}
            whileInView="visible"
            sx={{
                width: "100%",
                maxWidth: "1500px",
                margin: "0 auto",
                py: { xs: 6, md: 10 },
                px: { xs: 2, sm: 4, lg: 6 },
            }}
        >
            {title && (
                <DynamicTitle
                    title={title}
                    color={title_color || "#eeeeee"}
                    size="h4"
                    isMobile={false}
                    text_align="left"
                    id={id}
                    link_to_page={link_to_page}
                />
            )}
            <Box
                sx={{
                    mt: 6,
                }}
            >
                {/* <PixelCard
                    variant="blue"
                    roundedBorders={false}
                    focusOnMount={isMobile || false}
                    borders={false}
                    speed={2}
                > */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                        gap: { xs: 4, lg: 5 },
                        p: 4,
                    }}
                >
                    {projects?.map((project, index) => (
                        <ProjectItem
                            key={project.component_id || `project-${index}`}
                            project={project}
                        />
                    ))}
                </Box>
                {/* </PixelCard> */}
            </Box>
        </Box>
    );
};

export default DynamicProjectsSection;
