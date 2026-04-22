import { FC } from "react";
import { Box, Typography, Tooltip, Grid } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import RichTextRenderer from "../../RichTextRenderer";
import GlitchBackgroundCard from "../../GlitchBacgkroundCard";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import { motion } from "framer-motion";

export interface WorkExperienceItemProps {
    experience: LayoutWorkExperienceListItem;
    isMobile?: boolean;
}

const WorkExperienceItem: FC<WorkExperienceItemProps> = ({
    experience,
    isMobile,
}) => {
    const {
        title: expTitle,
        company,
        client,
        location,
        from,
        until,
        body,
        orientation,
    } = experience;

    const startDate = from
        ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              timeZone: "UTC",
          }).format(new Date(from))
        : "";

    let endDate = "Present";
    if (until) {
        const now = new Date();
        const end = new Date(until);
        if (end <= now) {
            endDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                timeZone: "UTC",
            }).format(end);
        }
    }

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
                <GlitchBackgroundCard isMobile={isMobile}>
                    <Box
                        sx={{
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            component="span"
                            variant="h6"
                            sx={{
                                fontWeight: 500,
                                color: experience.color || "#eeeeee",
                                lineHeight: 1.2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexDirection: isMobile ? "column" : "row",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                    width: !isMobile ? "50%" : "100%",
                                    gap: 1,
                                    flexDirection: isMobile ? "column" : "row",
                                }}
                            >
                                <WorkIcon fontSize="inherit" />
                                {expTitle}
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: !isMobile
                                        ? "flex-end"
                                        : "flex-start",
                                    alignItems: "flex-start",
                                    width: !isMobile ? "50%" : "100%",
                                }}
                            >
                                {orientation && (
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: "secondary.light",
                                            fontSize: "0.55em",
                                            ml: 1,
                                            fontWeight: 600,
                                            border: "1px solid",
                                            borderColor: "secondary.main",
                                            borderRadius: "4px",
                                            padding: "2px 8px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        {orientation}
                                    </Typography>
                                )}
                            </Box>
                        </Typography>
                        {(company || client) && (
                            <Typography
                                component="span"
                                variant="subtitle1"
                                sx={{
                                    color: "#e0e0e0",
                                    fontWeight: 600,
                                    display: "flex",
                                    gap: 1,
                                    mt: 1,
                                    fontSize: "1.15rem",
                                    flexDirection: isMobile ? "column" : "row",
                                    justifyContent: "flex-start",
                                    textAlign: isMobile ? "left" : "center",
                                    alignItems: isMobile
                                        ? "flex-start"
                                        : "center",
                                }}
                            >
                                <BusinessIcon
                                    sx={{
                                        fontSize: "1.2rem",
                                    }}
                                />
                                {company}{" "}
                                {client && (
                                    <span
                                        style={{
                                            color: "#b0b0b0",
                                            fontWeight: 500,
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        for {client}
                                    </span>
                                )}
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: 3,
                                mt: 1,
                                mb: 3,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#b0b0b0",
                                    fontWeight: 500,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    fontSize: "0.95rem",
                                }}
                            >
                                <CalendarTodayIcon
                                    sx={{
                                        fontSize: "1.1rem",
                                        mr: 1,
                                    }}
                                />
                                {startDate} - {endDate}
                            </Typography>
                            {location && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#b0b0b0",
                                        fontWeight: 500,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    <LocationOnIcon
                                        sx={{
                                            fontSize: "1.1rem",
                                            color: "error.light",
                                        }}
                                    />
                                    {location}
                                </Typography>
                            )}
                        </Box>

                        {body && (
                            <Box
                                sx={{
                                    mt: 1,
                                    flex: 1,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <RichTextRenderer
                                    content={body}
                                    color="#cccccc"
                                    fontSize="0.975rem"
                                    lineHeight={1.3}
                                />
                            </Box>
                        )}
                    </Box>
                </GlitchBackgroundCard>
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
