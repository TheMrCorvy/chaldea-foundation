import RichTextRenderer from "@/components/RichTextRenderer";
import { Typography } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";

const DynamicBlogText: FC<BlogText> = ({
    body,
    font_size,
    line_height,
    color,
    title,
    component_id,
}) => {
    return (
        <section
            id={component_id}
            aria-label={title || "Blog Text Section"}
            style={{ marginBottom: "2rem", width: "100%" }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    color: color || "inherit",
                    marginBottom: "1rem",
                }}
            >
                {title}
            </Typography>
            <RichTextRenderer
                content={body}
                fontSize={font_size || undefined}
                lineHeight={line_height || undefined}
                color={color || undefined}
            />
        </section>
    );
};

export default DynamicBlogText;
