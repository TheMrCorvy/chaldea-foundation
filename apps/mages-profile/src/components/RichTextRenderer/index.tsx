import { FC, Fragment, ReactNode } from "react";
import {
    Typography,
    Box,
    Link as MuiLink,
    List,
    ListItem,
} from "@mui/material";
import { JsonRichText, TextColors } from "@repo/type-definitions/dynamic-page";
import CodeBlock from "./CodeBlock";

export interface RichTextRendererProps {
    content: JsonRichText[];
    color?: string;
    fontSize?: string;
    lineHeight?: number;
    highlighted_text_color?: TextColors | null;
}

const RichTextRenderer: FC<RichTextRendererProps> = ({
    content,
    color,
    fontSize,
    lineHeight,
    highlighted_text_color,
}) => {
    const renderText = (node: JsonRichText, index: number) => {
        let element: ReactNode = node.text;

        if (node.bold) {
            element = (
                <Box
                    component="strong"
                    sx={{
                        color:
                            highlighted_text_color &&
                            highlighted_text_color !== "inherit"
                                ? `${highlighted_text_color}.main`
                                : "inherit",
                    }}
                >
                    {element}
                </Box>
            );
        }
        if (node.italic) {
            element = <em>{element}</em>;
        }
        if (node.underline) {
            element = <u>{element}</u>;
        }
        if (node.code) {
            element = (
                <Box
                    component="code"
                    sx={{
                        bgcolor: "grey.100",
                        px: 0.5,
                        borderRadius: 1,
                        fontFamily: "monospace",
                        color,
                        fontSize,
                        lineHeight,
                    }}
                >
                    {element}
                </Box>
            );
        }
        return <Fragment key={index}>{element}</Fragment>;
    };

    const renderNode = (node: JsonRichText, index: number): ReactNode => {
        switch (node.type) {
            case "code": {
                const codeContent =
                    node.plainText ||
                    node.children?.map((child) => child.text || "").join("") ||
                    "";
                return (
                    <CodeBlock
                        key={index}
                        code={codeContent}
                        language={node.language}
                    />
                );
            }

            case "paragraph":
                return (
                    <Typography
                        key={index}
                        sx={{
                            mb: 1,
                            color,
                            fontSize,
                            lineHeight,
                        }}
                    >
                        {node.children?.map(renderNode)}
                    </Typography>
                );

            case "heading": {
                const variant = `h${node.level}` as
                    | "h1"
                    | "h2"
                    | "h3"
                    | "h4"
                    | "h5"
                    | "h6";

                const headingTopMargin: Record<number, number> = {
                    1: 10,
                    2: 8,
                    3: 6,
                    4: 5,
                    5: 4,
                    6: 3,
                };
                const mt = headingTopMargin[node.level ?? 6] ?? 2;

                return (
                    <Typography
                        key={index}
                        variant={variant}
                        sx={{
                            mt,
                            mb: 2,
                            color,
                        }}
                    >
                        {node.children?.map(renderNode)}
                    </Typography>
                );
            }

            case "list":
                return (
                    <List
                        key={index}
                        sx={{
                            listStyleType: "disc",
                            pl: 4,
                            color,
                            fontSize,
                            lineHeight,
                        }}
                    >
                        {node.children?.map(renderNode)}
                    </List>
                );

            case "list-item":
                return (
                    <ListItem
                        key={index}
                        sx={{
                            display: "list-item",
                            py: 0,
                            color,
                            fontSize,
                            lineHeight,
                        }}
                    >
                        {node.children?.map(renderNode)}
                    </ListItem>
                );

            case "quote":
                return (
                    <Box
                        key={index}
                        sx={{
                            borderLeft: "4px solid",
                            borderColor: "grey.400",
                            pl: 2,
                            my: 2,
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontStyle="italic"
                            sx={{ color, fontSize, lineHeight }}
                        >
                            {node.children?.map(renderNode)}
                        </Typography>
                    </Box>
                );

            case "link":
                return (
                    <MuiLink
                        key={index}
                        href={node.url}
                        target={node.target || "_blank"}
                        rel={node.rel || "noopener noreferrer"}
                        sx={{ fontSize, lineHeight }}
                    >
                        {node.children?.map(renderNode)}
                    </MuiLink>
                );

            default:
                if (node.text !== undefined) {
                    return renderText(node, index);
                }
                return node.children?.map(renderNode);
        }
    };
    return (
        <Box sx={{ color, fontSize, lineHeight }}>
            {content.map(renderNode)}
        </Box>
    );
};

export default RichTextRenderer;
