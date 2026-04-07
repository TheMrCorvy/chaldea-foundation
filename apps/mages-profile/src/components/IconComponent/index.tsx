"use client";

import { ComponentType, FC } from "react";
import { SvgIconProps } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

// Define a type for valid icon names from MUI
export type IconName = keyof typeof MuiIcons;

export interface IconComponentProps extends Omit<SvgIconProps, "component"> {
    name: IconName;
    size?: "small" | "inherit" | "large" | "medium" | null;
}

const IconComponent: FC<IconComponentProps> = ({
    name,
    size = "medium",
    color,
    ...props
}) => {
    const IconElement = MuiIcons[name] as ComponentType<SvgIconProps>;

    if (!IconElement) {
        return null;
    }

    return (
        <IconElement {...props} fontSize={size || undefined} color={color} />
    );
};

export default IconComponent;
