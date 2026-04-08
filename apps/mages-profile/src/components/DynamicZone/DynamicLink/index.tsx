import IconComponent from "@/components/IconComponent";
import { Link, Tooltip } from "@mui/material";
import { LayoutLink } from "@repo/type-definitions/dynamic-page";
import { FC, ReactElement } from "react";

const DynamicLink: FC<LayoutLink> = ({
    label,
    target,
    icon,
    href,
    popover,
    variant,
}) => {
    if (popover) {
        return (
            <WithTooltip popover={popover}>
                <VariantDecider {...{ label, target, icon, href, variant }} />
            </WithTooltip>
        );
    }

    return (
        <Link href={href} target={target}>
            {label}
        </Link>
    );
};

export interface WithTooltipProps {
    children: ReactElement;
    popover: string;
}

const WithTooltip: FC<WithTooltipProps> = ({ children, popover }) => {
    return (
        <Tooltip title={popover || ""} placement="top">
            {children}
        </Tooltip>
    );
};

export interface VariantDeciderProps {
    label: string;
    target?: string;
    icon?: LayoutLink["icon"];
    href: string;
    variant: LayoutLink["variant"];
}

const VariantDecider: FC<VariantDeciderProps> = ({
    label,
    target,
    icon,
    href,
    variant,
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
                        color: "rgba(255, 255, 255, 0.6)",
                        display: "flex",
                        padding: "8px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            color: "#ffffff",
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            transform: "scale(1.05)",
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
                        color: "rgba(255, 255, 255, 0.7)",
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
                            color: "#ffffff",
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
                    color="primary"
                    target={target}
                    href={href}
                    underline="hover"
                    rel="noopener noreferrer"
                >
                    {label}
                </Link>
            );
    }
};

export default DynamicLink;
