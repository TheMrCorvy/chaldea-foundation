import IconComponent from "@/components/IconComponent";
import { Box, Link, Tooltip } from "@mui/material";
import { LayoutLink } from "@repo/type-definitions/dynamic-page";
import { FC, ReactElement } from "react";

const DynamicLink: FC<LayoutLink> = ({
    label,
    target,
    icon,
    href,
    popover,
    variant,
    color,
}) => {
    if (popover) {
        return (
            <Tooltip title={popover} placement="top" arrow>
                <Box display="inline-block">
                    <VariantDecider
                        {...{ label, target, icon, href, variant, color }}
                    />
                </Box>
            </Tooltip>
        );
    }

    return (
        <VariantDecider {...{ label, target, icon, href, variant, color }} />
    );
};

export interface WithTooltipProps {
    children: ReactElement;
    popover: string;
}

export interface VariantDeciderProps {
    label: string;
    target?: string;
    icon?: LayoutLink["icon"];
    href: string;
    variant: LayoutLink["variant"];
    color: LayoutLink["color"];
}

const VariantDecider: FC<VariantDeciderProps> = ({
    label,
    target,
    icon,
    href,
    variant,
    color,
}) => {
    switch (variant) {
        case "link":
            return (
                <Link
                    color="primary"
                    target={target}
                    href={href}
                    underline="hover"
                    rel="noopener noreferrer"
                    sx={{
                        color:
                            color !== "inherit" ? `${color}.main` : "inherit",
                        "&:hover": {
                            color:
                                color !== "inherit"
                                    ? `${color}.light`
                                    : "inherit",
                        },
                    }}
                >
                    {label}
                </Link>
            );
        case "icon_link":
            return (
                <Link
                    href={href}
                    underline="none"
                    sx={{
                        color:
                            color !== "inherit" ? `${color}.main` : "inherit",
                        display: "flex",
                        padding: "8px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            transform: "scale(1.05)",
                            color:
                                color !== "inherit"
                                    ? `${color}.light`
                                    : "inherit",
                        },
                    }}
                    target={target}
                    rel="noopener noreferrer"
                >
                    {icon && (
                        <IconComponent
                            name={icon.name}
                            size={icon.size}
                            color={icon.color}
                        />
                    )}
                </Link>
            );
        case "link_with_icon":
            return (
                <Link
                    href={href}
                    underline="none"
                    sx={{
                        color:
                            color !== "inherit" ? `${color}.main` : "inherit",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s ease",
                        padding: "3px 10px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        "&:hover": {
                            color:
                                color !== "inherit"
                                    ? `${color}.light`
                                    : "inherit",
                        },
                    }}
                    target={target}
                    rel="noopener noreferrer"
                >
                    {label}
                    {icon && (
                        <IconComponent
                            name={icon.name}
                            size={icon.size}
                            color={icon.color}
                        />
                    )}
                </Link>
            );
        default:
            return (
                <Link
                    target={target}
                    href={href}
                    underline="hover"
                    rel="noopener noreferrer"
                    sx={{
                        color:
                            color !== "inherit" ? `${color}.main` : "inherit",
                        "&:hover": {
                            color:
                                color !== "inherit"
                                    ? `${color}.light`
                                    : "inherit",
                        },
                    }}
                >
                    {label}
                </Link>
            );
    }
};

export default DynamicLink;
