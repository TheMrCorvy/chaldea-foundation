import { Box, Typography } from "@mui/material";
import { FC } from "react";

export interface ExperienceItem {
    position: string;
    orientation?: string; // e.g. "Frontend Oriented"
    company: string;
    client?: string;
    startDate: string; // "Dec 2025"
    endDate: string; // "Present" | "Oct 2023"
    body: string;
}

export interface ExperienceListItemProps {
    experience: ExperienceItem;
    isMobile?: boolean;
}

const ExperienceListItem: FC<ExperienceListItemProps> = ({
    experience,
    isMobile,
}) => {
    const { position, orientation, company, client, startDate, endDate, body } =
        experience;

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
                    pt: 0.4,
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        color: "common.white",
                        // lineHeight: 1.3,
                    }}
                >
                    •
                </Typography>
            </Box>
            {/* Title line */}
            <Box component="span">
                <Box
                    component="span"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        verticalAlign: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: "common.white",
                            lineHeight: 1.3,
                        }}
                    >
                        {position}
                    </Typography>
                    <Typography
                        component="span"
                        sx={{
                            color: "grey.300",
                            display: "block",
                            lineHeight: 1.3,
                            fontSize: "0.8rem",
                        }}
                    >
                        {orientation && ` (${orientation})`}
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
                        }}
                    >
                        {startDate} → {endDate}
                    </Typography>
                </Box>

                {/* body */}
                <Typography
                    variant={isMobile ? "caption" : "body2"}
                    sx={{
                        color: isMobile ? "grey.100" : "grey.400",
                        display: "block",
                        mt: 0.5,
                        lineHeight: 1.4,
                    }}
                >
                    {body}
                </Typography>
            </Box>
        </Box>
    );
};

export default ExperienceListItem;
