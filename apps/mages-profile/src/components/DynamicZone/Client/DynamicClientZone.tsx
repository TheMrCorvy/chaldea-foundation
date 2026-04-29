"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Box } from "@mui/material";
import { StrapiSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicZoneComponentForClient from ".";

export interface DynamicClientZoneProps {
    sections: StrapiSection[];
    imageBaseUrl: string;
}

const DynamicClientZone: FC<DynamicClientZoneProps> = ({
    sections,
    imageBaseUrl,
}) => {
    const isMobile = useMediaQuery().max.width("sm");
    return (
        <Box
            component="article"
            sx={{
                px: { xs: 2, md: 6, lg: 7, xl: 8 },
                py: { xs: 6, lg: 12 },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 6, md: 8, lg: 16, xl: 22 },
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {sections.map((section) => (
                <DynamicZoneComponentForClient
                    section={section}
                    key={section.component_id}
                    imageBaseUrl={imageBaseUrl}
                    isMobile={isMobile}
                />
            ))}
        </Box>
    );
};

export default DynamicClientZone;
