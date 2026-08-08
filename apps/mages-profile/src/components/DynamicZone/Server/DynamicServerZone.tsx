import { Box } from "@mui/material";
import { StrapiSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicZoneComponent from ".";

export interface DynamycServerZone {
    sections: StrapiSection[];
    imageBaseUrl: string;
    currentPostSlug?: string;
}

const DynamycServerZone: FC<DynamycServerZone> = ({
    sections,
    imageBaseUrl,
    currentPostSlug,
}) => {
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
                <DynamicZoneComponent
                    section={section}
                    key={section.component_id}
                    imageBaseUrl={imageBaseUrl}
                    currentPostSlug={currentPostSlug || ""}
                />
            ))}
        </Box>
    );
};

export default DynamycServerZone;
