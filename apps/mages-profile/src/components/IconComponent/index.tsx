"use client";

import { ComponentType, FC } from "react";
import { SvgIconProps } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

// Define a type for valid icon names from MUI
type IconName = keyof typeof MuiIcons;

export interface IconComponentProps extends Omit<SvgIconProps, "component"> {
    icon: IconName;
}

const IconComponent: FC<IconComponentProps> = ({ icon, ...props }) => {
    const IconElement = MuiIcons[icon] as ComponentType<SvgIconProps>;

    if (!IconElement) {
        return null;
    }

    return <IconElement {...props} />;
};

export default IconComponent;
