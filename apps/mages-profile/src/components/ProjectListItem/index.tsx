import { Box, Chip, Link, Typography } from "@mui/material";
import { LayoutProjectListItem } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../RichTextRenderer";

export interface ProjectListItemProps {
    project: LayoutProjectListItem;
}

const ProjectListItem: FC<ProjectListItemProps> = ({ project }) => {
    const { title, highlighted_subtitle, body, links, disable_primary_link } =
        project;

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
                backgroundColor: "rgba(255,255,255,0.06)",
                backdropFilter: `blur(1px)`,
                WebkitBackdropFilter: `blur(1px)`,
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
                    mb: 0.5,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: "common.white",
                        fontWeight: 700,
                        fontSize: "1rem",
                        lineHeight: 1.3,
                        minWidth: 0,
                    }}
                >
                    {title}
                </Typography>

                {links[0] && !disable_primary_link && (
                    <Chip
                        component={Link}
                        clickable
                        href={links[0].href}
                        label={links[0].label}
                        size="small"
                        target={links[0].target || "_self"}
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
                color="grey.300"
                fontSize="0.8rem"
                lineHeight={1.35}
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
                    {body.chips.map((chip) => (
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

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                }}
            >
                {links.map((link, index) =>
                    index === 0 && !disable_primary_link ? null : (
                        <Link
                            key={link.component_id}
                            href={link.href}
                            underline="hover"
                            target={link.target || "_blank"}
                            sx={{
                                color: "grey.400",
                                fontSize: "0.7rem",
                                alignSelf: "flex-start",
                                mt: 1,
                            }}
                        >
                            {link.label}
                        </Link>
                    )
                )}
            </Box>
        </Box>
    );
};

export default ProjectListItem;
