import { FC, Fragment, ReactNode } from "react";
import {
    Typography,
    Box,
    Link as MuiLink,
    List,
    ListItem,
} from "@mui/material";
import { JsonRichText } from "@repo/type-definitions/dynamic-page";

type MuiTextColor = "primary" | "secondary" | "error" | "warning" | "info";

const resolveTextColor = (node: JsonRichText): MuiTextColor | null => {
    if (node.color) {
        if (node.color === "danger") {
            return "error";
        }

        if (
            node.color === "primary" ||
            node.color === "secondary" ||
            node.color === "error" ||
            node.color === "warning" ||
            node.color === "info"
        ) {
            return node.color;
        }
    }

    if (node.color_primary) return "primary";
    if (node.color_secondary) return "secondary";
    if (node.color_danger) return "error";
    if (node.color_warning) return "warning";
    if (node.color_info) return "info";

    return null;
};

interface RichTextRendererProps {
    content: JsonRichText[];
}

const RichTextRenderer: FC<RichTextRendererProps> = ({ content }) => {
    const renderText = (node: JsonRichText, index: number) => {
        let element: ReactNode = node.text;
        const color = resolveTextColor(node);

        if (color) {
            element = (
                <Box component="span" sx={{ color: `${color}.main` }}>
                    {element}
                </Box>
            );
        }

        if (node.bold) {
            element = <strong>{element}</strong>;
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
            case "paragraph":
                return (
                    <Typography key={index} paragraph>
                        {node.children?.map(renderNode)}
                    </Typography>
                );

            case "heading":
                const variant = `h${node.level}` as
                    | "h1"
                    | "h2"
                    | "h3"
                    | "h4"
                    | "h5"
                    | "h6";

                return (
                    <Typography
                        key={index}
                        variant={variant}
                        gutterBottom
                        fontWeight={600}
                    >
                        {node.children?.map(renderNode)}
                    </Typography>
                );

            case "list":
                return (
                    <List key={index} sx={{ listStyleType: "disc", pl: 4 }}>
                        {node.children?.map(renderNode)}
                    </List>
                );

            case "list-item":
                return (
                    <ListItem key={index} sx={{ display: "list-item", py: 0 }}>
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
                        <Typography variant="body1" fontStyle="italic">
                            {node.children?.map(renderNode)}
                        </Typography>
                    </Box>
                );

            case "link":
                return (
                    <MuiLink
                        key={index}
                        href={node.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {node.children?.map(renderNode)}
                    </MuiLink>
                );

            default: // text node
                if (node.text !== undefined) {
                    return renderText(node, index);
                }
                return node.children?.map(renderNode);
        }
    };
    return <Box>{content.map(renderNode)}</Box>;
};

export default RichTextRenderer;
