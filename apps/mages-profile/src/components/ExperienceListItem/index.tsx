import { Box, Typography } from "@mui/material";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../RichTextRenderer";

export interface ExperienceListItemProps {
    experience: LayoutWorkExperienceListItem;
    isMobile?: boolean;
    color?: string | null;
}

const ExperienceListItem: FC<ExperienceListItemProps> = ({
    experience,
    isMobile,
    color,
}) => {
    const {
        title,
        orientation,
        company,
        client,
        from,
        until,
        body,
        location,
        highlighted_text_color,
        font_size,
        line_height,
        text_align,
    } = experience;

    const startDate = new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "2-digit",
        timeZone: "UTC",
    }).format(new Date(from));

    const endDate = () => {
        const now = new Date();
        const end = new Date(until);

        if (end > now) {
            return "Present";
        }

        return new Intl.DateTimeFormat("en-US", {
            year: "2-digit",
            month: "2-digit",
            timeZone: "UTC",
        }).format(new Date(until));
    };

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    height: "100%",
                    justifyContent: "start",
                    alignContent: "start",
                    alignItems: "start",
                    verticalAlign: "start",
                    px: 1,
                    pt: 1.2,
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        color: color || "common.white",
                        lineHeight: 0.7,
                        fontSize: "1.5rem",
                    }}
                >
                    •
                </Typography>
            </Box>
            {/* Title line */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        verticalAlign: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                color: color || "common.white",
                                fontSize: font_size || "0.9rem",
                                lineHeight: line_height || 1.3,
                            }}
                        >
                            {title}
                        </Typography>
                        {orientation && !isMobile && (
                            <Typography
                                component="span"
                                sx={{
                                    color: color || "grey.300",
                                    display: "block",
                                    lineHeight: line_height || 1.3,
                                    pl: 0.2,
                                    fontSize: font_size || "0.8rem",
                                }}
                            >
                                {`(${orientation})`}
                            </Typography>
                        )}
                    </Box>
                    <Typography
                        variant="body2"
                        color={color || "common.white"}
                        sx={{
                            fontSize: font_size || "0.8rem",
                            lineHeight: line_height || 1.3,
                        }}
                    >
                        {location}
                    </Typography>
                </Box>
                <Box
                    component="span"
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        pt: 0.5,
                        mb: 1,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            color: color || "common.white",
                            lineHeight: line_height || 1.3,
                            fontSize: font_size || "0.875rem",
                        }}
                    >
                        {company} {client && ` / ${client}`}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 400,
                            color: color || "common.white",
                            lineHeight: line_height || 1.3,
                            fontSize: font_size || "0.8rem",
                        }}
                    >
                        {startDate} → {endDate()}
                    </Typography>
                </Box>

                <Box
                    component="span"
                    sx={{
                        textAlign: text_align || "inherit",
                    }}
                >
                    <RichTextRenderer
                        content={body}
                        fontSize={font_size || "0.875rem"}
                        lineHeight={line_height || 1.4}
                        color={color || "grey.500"}
                        highlighted_text_color={highlighted_text_color}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ExperienceListItem;
