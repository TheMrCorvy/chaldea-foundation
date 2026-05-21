import { Box } from "@mui/material";
import { LayoutDescriptionWithChipsList } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import RichTextRenderer from "../../../RichTextRenderer";
import ChipsRenderer from "./ChipsRenderer";
import DynamicTitle from "../../Shared/DynamicTitle";

export interface DynamicDescriptionWithChipsListProps extends LayoutDescriptionWithChipsList {
    renderTitle?: boolean;
}

const DynamicDescriptionWithChipsList: FC<
    DynamicDescriptionWithChipsListProps
> = ({
    body,
    font_size,
    line_height,
    color,
    chips,
    title,
    text_align,
    highlighted_text_color,
    logo_loop,
    vertical_logo_loop,
    component_id,
    id,
    renderTitle = true,
}) => {
    return (
        <Box
            component={"section"}
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: "1300px",
                color: color || "rgba(222, 233, 241, 0.95)",
                textAlign: text_align || "center",
            }}
        >
            {title && renderTitle && (
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
                    fontSize: font_size || "1rem",
                    lineHeight: line_height || 1.6,
                    mt: 3,
                    "& p": {
                        margin: 0,
                        marginBottom: "1rem",
                    },
                    "& p:last-child": {
                        marginBottom: 0,
                    },
                }}
            >
                <RichTextRenderer
                    content={body}
                    color={color || "inherit"}
                    fontSize={font_size || "inherit"}
                    lineHeight={line_height || undefined}
                    highlighted_text_color={highlighted_text_color}
                />
            </Box>

            <ChipsRenderer
                chips={chips}
                logo_loop={logo_loop}
                vertical_logo_loop={vertical_logo_loop}
                component_id={component_id}
                id={id}
            />
        </Box>
    );
};

export default DynamicDescriptionWithChipsList;
