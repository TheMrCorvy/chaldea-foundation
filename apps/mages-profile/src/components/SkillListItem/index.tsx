import { FC } from "react";
import IconComponent, { IconName } from "../IconComponent";
import { Tooltip, Typography } from "@mui/material";

export interface SkillListItemProps {
    icon?: IconName;
    title: string;
    popover?: string;
    size?: "inherit" | "small" | "medium" | "large";
    color?:
        | "inherit"
        | "disabled"
        | "action"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning";
}

const SkillListItem: FC<SkillListItemProps> = ({
    icon,
    title,
    popover,
    size = "medium",
    color = "inherit",
}) => {
    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexDirection: "column",
                textAlign: "center",
            }}
        >
            {icon && <IconComponent size={size} name={icon} color={color} />}
            <Typography variant="caption" fontSize={10} align="center">
                {title}
            </Typography>
            {popover && (
                <Tooltip title={popover} placement="top">
                    <IconComponent name="Info" size="small" />
                </Tooltip>
            )}
        </span>
    );
};

export default SkillListItem;
