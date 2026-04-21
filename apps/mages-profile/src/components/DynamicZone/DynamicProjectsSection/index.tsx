"use client";

import { Box, Typography, Tooltip, Stack } from "@mui/material";
import {
    LayoutProjectListItem,
    SectionsProjectsSection,
} from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import DynamicLink from "../DynamicLink";
import IconComponent from "../../IconComponent";
import DynamicDescriptionWithChipsList from "../DynamicDescriptionWithChipsList";
import DynamicTitle from "../DynamicTitle";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const ProjectCard: FC<{ project: LayoutProjectListItem }> = ({ project }) => {
    const {
        title,
        highlighted_subtitle,
        popover,
        icon,
        body,
        cover_image,
        links,
        disable_primary_link,
    } = project;

    const cardContent = (
        <Box
            component={motion.div}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                border: "1px solid rgba(56, 182, 255, 0.3)",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "rgba(8, 20, 40, 0.6)",
                backdropFilter: "blur(8px)",
                boxShadow:
                    "0 4px 20px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(56, 182, 255, 0.05)",
                transition: "all 0.3s ease",
                opacity: disable_primary_link ? 0.7 : 1,
                "&:hover": {
                    borderColor: "rgba(56, 182, 255, 0.7)",
                    boxShadow:
                        "0 8px 25px rgba(56, 182, 255, 0.15), inset 0 0 25px rgba(56, 182, 255, 0.15)",
                },
            }}
        >
            {/* Project Image */}
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: "180px", sm: "220px", md: "250px" },
                    borderBottom: "1px solid rgba(56, 182, 255, 0.3)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    overflow: "hidden",
                }}
            >
                {cover_image?.url ? (
                    <Image
                        src={cover_image.url}
                        alt={
                            cover_image.alternativeText ||
                            title ||
                            "Project Cover"
                        }
                        fill
                        style={{
                            objectFit: "cover",
                            mixBlendMode: "screen",
                            opacity: 0.85,
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(56, 182, 255, 0.4)",
                                letterSpacing: "0.2em",
                            }}
                        >
                            NO VISUAL DATA
                        </Typography>
                    </Box>
                )}

                {/* Scanline Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(rgba(25, 118, 210, 0.1) 50%, rgba(0, 0, 0, 0.1) 50%)",
                        backgroundSize: "100% 4px",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}
                />
            </Box>

            {/* Project Details */}
            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                {/* Header (Icon + Title) */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                    }}
                >
                    {icon && (
                        <Box sx={{ color: "rgba(56, 182, 255, 0.9)" }}>
                            <IconComponent {...icon} />
                        </Box>
                    )}
                    {title && (
                        <Typography
                            variant="h5"
                            sx={{
                                color: "rgba(255, 255, 255, 0.95)",
                                fontWeight: "bold",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
                            }}
                        >
                            {title}
                        </Typography>
                    )}
                </Box>

                {highlighted_subtitle && (
                    <Typography
                        variant="subtitle2"
                        sx={{
                            color: "rgba(146, 232, 255, 0.8)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            mb: 2,
                            borderLeft: "2px solid rgba(56, 182, 255, 0.5)",
                            pl: 1.5,
                        }}
                    >
                        {highlighted_subtitle}
                    </Typography>
                )}

                {/* Body (Description & Chips) */}
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                    {body && <DynamicDescriptionWithChipsList {...body} />}
                </Box>

                {/* Links */}
                {links && links.length > 0 && (
                    <Stack
                        direction="row"
                        spacing={2}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{
                            mt: "auto",
                            pt: 2,
                            borderTop: "1px solid rgba(56, 182, 255, 0.15)",
                        }}
                    >
                        {links.map((link, index) => (
                            <Box key={`project-link-${index}`} sx={{ mb: 1 }}>
                                <DynamicLink {...link} />
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );

    return popover ? (
        <Tooltip title={popover} placement="top" arrow>
            {cardContent}
        </Tooltip>
    ) : (
        cardContent
    );
};

const DynamicProjectsSection: FC<SectionsProjectsSection> = ({
    title,
    title_color,
    link_to_page,
    projects,
    component_id,
}) => {
    return (
        <Box
            id={component_id}
            component={motion.section}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            sx={{
                width: "100%",
                maxWidth: "1500px",
                margin: "0 auto",
                py: { xs: 6, md: 10 },
                px: { xs: 2, sm: 4, lg: 6 },
            }}
        >
            {/* Section Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    mb: { xs: 4, md: 6 },
                    gap: 2,
                    borderBottom: "1px solid rgba(56, 182, 255, 0.2)",
                    pb: 2,
                }}
            >
                {title && (
                    <DynamicTitle
                        title={title}
                        color={title_color || "#eeeeee"}
                        size="h4"
                        isMobile={false}
                        text_align="left"
                    />
                )}

                {link_to_page && (
                    <Box component={motion.div} variants={itemVariants}>
                        <DynamicLink {...link_to_page} />
                    </Box>
                )}
            </Box>

            {/* Projects Grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: { xs: 4, lg: 5 },
                }}
            >
                {projects?.map((project, index) => (
                    <ProjectCard
                        key={project.component_id || `project-${index}`}
                        project={project}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default DynamicProjectsSection;
