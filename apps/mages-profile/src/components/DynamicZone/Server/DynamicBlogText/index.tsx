"use server";

import RichTextRenderer from "@/components/RichTextRenderer";
import { Box } from "@mui/material";
import { BlogText } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import useStyles from "./useStyles";
import DynamicTitle from "../DynamicTitle";

const DynamicBlogText: FC<BlogText> = ({
    body,
    font_size,
    line_height,
    color,
    title,
    component_id,
    text_align,
    highlighted_text_color,
    id,
}) => {
    const { root } = useStyles();
    return (
        <Box
            component="section"
            id={component_id}
            aria-label={title || "Blog Text Section"}
            sx={root}
        >
            {title && (
                <DynamicTitle
                    title={title}
                    color={color || "#eeeeee"}
                    size="h4"
                    text_align={text_align || "center"}
                    id={id}
                />
            )}
            <Box
                component={"div"}
                sx={{
                    textAlign: text_align || "center",
                }}
            >
                <RichTextRenderer
                    content={body}
                    fontSize={font_size || undefined}
                    lineHeight={line_height || undefined}
                    color={color || undefined}
                    highlighted_text_color={highlighted_text_color}
                />
            </Box>
        </Box>
    );
};

export default DynamicBlogText;
