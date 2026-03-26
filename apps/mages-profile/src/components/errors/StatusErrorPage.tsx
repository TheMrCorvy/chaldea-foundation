"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import useStyles from "./useStyles";

interface StatusErrorPageProps {
    statusCode: number;
    title: string;
    description: string;
    accentColor: string;
    accentSoftColor: string;
    backgroundTop: string;
    backgroundBottom: string;
    details?: string;
    primaryActionLabel?: string;
    primaryActionHref?: string;
    secondaryAction?: ReactNode;
}

export function StatusErrorPage({
    statusCode,
    title,
    description,
    accentColor,
    accentSoftColor,
    backgroundTop,
    backgroundBottom,
    details,
    primaryActionLabel = "Back to home",
    primaryActionHref = "/",
    secondaryAction,
}: StatusErrorPageProps) {
    const {
        root,
        floatErrorBlob,
        positionRelative,
        paper,
        chip,
        statusCodeStyles,
        mainTitle,
        descriptionStyles,
        detailsStyles,
        buttonStyles,
    } = useStyles();
    return (
        <Box
            sx={{
                ...root,
                background: `radial-gradient(circle at 20% 20%, ${accentSoftColor} 0%, transparent 40%), linear-gradient(160deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
            }}
        >
            <Box
                sx={{
                    ...floatErrorBlob,
                    bgcolor: accentSoftColor,
                }}
            />
            <Container maxWidth="sm" sx={positionRelative}>
                <Paper
                    elevation={0}
                    sx={{
                        ...paper,
                        border: `1px solid ${accentSoftColor}`,
                    }}
                >
                    <Stack spacing={2.5} alignItems="flex-start">
                        <Chip
                            label={`Error ${statusCode}`}
                            sx={{
                                ...chip,
                                bgcolor: accentColor,
                            }}
                        />
                        <Typography
                            variant="h2"
                            sx={{
                                ...statusCodeStyles,
                                color: accentColor,
                            }}
                        >
                            {statusCode}
                        </Typography>
                        <Typography variant="h4" sx={mainTitle}>
                            {title}
                        </Typography>
                        <Typography variant="body1" sx={descriptionStyles}>
                            {description}
                        </Typography>
                        {details ? (
                            <Typography variant="body2" sx={detailsStyles}>
                                {details}
                            </Typography>
                        ) : null}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            width="100%"
                        >
                            <Button
                                href={primaryActionHref}
                                variant="contained"
                                size="large"
                                disableElevation
                                sx={{
                                    ...buttonStyles,
                                    bgcolor: accentColor,
                                    "&:hover": {
                                        bgcolor: accentColor,
                                        filter: "brightness(0.92)",
                                    },
                                }}
                            >
                                {primaryActionLabel}
                            </Button>
                            {secondaryAction ?? null}
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
