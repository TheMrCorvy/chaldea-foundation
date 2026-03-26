import { Box, Chip, Link, Typography } from "@mui/material";
import { LayoutProjectListItem } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../RichTextRenderer";

export interface ProjectListItemProps {
    project: LayoutProjectListItem;
}

const ProjectListItem: FC<ProjectListItemProps> = ({ project }) => {
    const { title, highlighted_subtitle, body, links } = project;
    const primaryLink = links[0] || null;

    return (
        <Box
            component="article"
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.16)",
                backgroundColor: "rgba(255,255,255,0.04)",
                px: "3%",
                py: "2.5%",
                gap: "4px",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "2%",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: "common.white",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        lineHeight: 1.3,
                        minWidth: 0,
                    }}
                >
                    {title}
                </Typography>

                {primaryLink?.label && (
                    <Chip
                        component={Link}
                        clickable
                        href={primaryLink.href}
                        label={primaryLink.label}
                        size="small"
                        sx={{
                            height: "auto",
                            borderRadius: "6px",
                            color: "common.white",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backgroundColor: "transparent",
                            "& .MuiChip-label": {
                                px: "8px",
                                py: "2px",
                                fontSize: "0.7rem",
                                lineHeight: 1.2,
                            },
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.1)",
                            },
                        }}
                    />
                )}
            </Box>

            {highlighted_subtitle && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "grey.400",
                        fontSize: "0.72rem",
                        lineHeight: 1.3,
                    }}
                >
                    {highlighted_subtitle}
                </Typography>
            )}

            <RichTextRenderer
                content={body.body}
                sx={{
                    color: "grey.300",
                    fontSize: "0.8rem",
                    lineHeight: 1.35,
                }}
            />

            {body.chips && body.chips.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        pt: "1%",
                    }}
                >
                    {body.chips.slice(0, 4).map((chip) => (
                        <Chip
                            key={chip.component_id}
                            label={chip.title}
                            size="small"
                            sx={{
                                color: "grey.200",
                                backgroundColor: "rgba(255,255,255,0.08)",
                                "& .MuiChip-label": {
                                    px: "6px",
                                    fontSize: "0.68rem",
                                },
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ProjectListItem;
