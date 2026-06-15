import { FC } from "react";
import { WorkExperienceItemProps } from "../../Client/DynamicWorkExperienceSection/WorkExperienceItem";
import { Box, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import RichTextRenderer from "../../../RichTextRenderer";
import GlitchBackgroundCard from "../../../GlitchBacgkroundCard";
import useStyles from "./useStyles";

const WorkExperienceItemContent: FC<WorkExperienceItemProps> = ({
    experience,
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
        color,
        line_height,
        font_size,
        highlighted_text_color,
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

    const {
        root,
        titleContainer,
        titleBox,
        orientationBox,
        orientationStyles,
        companyClient,
        companyStyles,
        clientStyles,
        datesContainer,
        dateStyles,
        locationStyles,
        richTextContainer,
    } = useStyles();

    return (
        <GlitchBackgroundCard>
            <Box sx={root}>
                <Typography
                    component="span"
                    variant="h6"
                    sx={{
                        ...titleContainer,
                        color: experience.color || "#eeeeee",
                    }}
                >
                    <Box sx={titleBox}>
                        <WorkIcon fontSize="inherit" />
                        {expTitle}
                    </Box>
                    <Box sx={orientationBox}>
                        {orientation && (
                            <Typography component="span" sx={orientationStyles}>
                                {orientation}
                            </Typography>
                        )}
                    </Box>
                </Typography>
                <Box sx={companyClient}>
                    {company && (
                        <Typography
                            component="span"
                            variant="subtitle1"
                            sx={companyStyles}
                        >
                            <BusinessIcon
                                sx={{
                                    fontSize: "1.2rem",
                                }}
                            />
                            {company}
                        </Typography>
                    )}
                    {client && (
                        <Typography sx={clientStyles}>for {client}</Typography>
                    )}
                </Box>
                <Box sx={datesContainer}>
                    <Typography variant="body2" sx={dateStyles}>
                        <CalendarTodayIcon
                            sx={{
                                fontSize: "1.1rem",
                                mr: 1,
                            }}
                        />
                        {startDate} - {endDate}
                    </Typography>
                    {location && (
                        <Typography variant="body2" sx={locationStyles}>
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
                    <Box sx={richTextContainer}>
                        <RichTextRenderer
                            content={body}
                            color={color || "#cccccc"}
                            fontSize={font_size || "0.975rem"}
                            lineHeight={line_height || 1.3}
                            highlighted_text_color={
                                highlighted_text_color || "info"
                            }
                        />
                    </Box>
                )}
            </Box>
        </GlitchBackgroundCard>
    );
};

export default WorkExperienceItemContent;
