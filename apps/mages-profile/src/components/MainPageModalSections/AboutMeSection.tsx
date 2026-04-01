import { Box } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../RichTextRenderer";

export interface AboutMeSectionProps extends BlogText {
    isMobile: boolean;
}

const AboutMeSection: FC<AboutMeSectionProps> = ({
    body,
    component_id,
    isMobile,
}) => {
    return (
        <Box
            component="section"
            id={component_id}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                px: 1,
                maxHeight: isMobile ? "65dvh" : "54dvh",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { width: "1%" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(127, 214, 255, 0.45)",
                    borderRadius: "999px",
                },
            }}
        >
            <RichTextRenderer
                content={body}
                color="grey.300"
                fontSize="0.85rem"
                lineHeight={1.5}
            />
        </Box>
    );
};

export default AboutMeSection;
