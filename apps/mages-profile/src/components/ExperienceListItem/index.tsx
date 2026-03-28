import { Box, Typography } from "@mui/material";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../RichTextRenderer";

export interface ExperienceListItemProps {
    experience: LayoutWorkExperienceListItem;
}

const ExperienceListItem: FC<ExperienceListItemProps> = ({ experience }) => {
    const { title, orientation, company, client, from, until, body, location } =
        experience;

    const startDate = new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "2-digit",
        timeZone: "UTC",
    }).format(new Date(from));

    const endDate = new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "2-digit",
        timeZone: "UTC",
    }).format(new Date(until));

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
                        color: "common.white",
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
                            flexDirection: "row",
                            gap: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                color: "common.white",
                                fontSize: "0.9rem",
                                lineHeight: 1.3,
                            }}
                        >
                            {title}
                        </Typography>
                        {orientation && (
                            <Typography
                                component="span"
                                sx={{
                                    color: "grey.300",
                                    display: "block",
                                    fontSize: "0.8rem",
                                    lineHeight: 1.3,
                                    pl: 0.2,
                                }}
                            >
                                {`(${orientation})`}
                            </Typography>
                        )}
                    </Box>
                    <Typography
                        variant="body2"
                        color="common.white"
                        sx={{
                            fontSize: "0.8rem",
                            lineHeight: 1.3,
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
                            color: "common.white",
                            lineHeight: 1.3,
                            fontSize: "0.875rem",
                        }}
                    >
                        {company} {client && ` / ${client}`}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 400,
                            color: "common.white",
                            lineHeight: 1.3,
                            fontSize: "0.8rem",
                        }}
                    >
                        {startDate} → {endDate}
                    </Typography>
                </Box>

                <Box component="span">
                    <RichTextRenderer
                        content={body}
                        fontSize="0.875rem"
                        lineHeight={1.4}
                        color="grey.500"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ExperienceListItem;
