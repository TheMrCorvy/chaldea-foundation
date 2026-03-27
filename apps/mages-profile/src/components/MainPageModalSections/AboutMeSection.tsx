import { Box } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../RichTextRenderer";

const AboutMeSection: FC<BlogText> = ({ body, component_id }) => {
    return (
        <Box
            component="section"
            id={"main-page-about-me-section-" + component_id}
            sx={{
                height: "100%",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                px: 1,
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderRadius: "2px",
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
