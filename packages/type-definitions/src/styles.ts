import { SxProps } from "@mui/joy/styles/types";
import type { SxProps as MUISxProps, Theme } from "@mui/material/styles";

export interface Styles {
    [key: string]: SxProps;
}

export type ThemeOptions = "light" | "dark";

interface BaseProps {
    theme?: ThemeOptions;
}

interface BooleanFlags {
    [key: string]: boolean | undefined;
}

export type StylesServiceProps = BaseProps & BooleanFlags;

export type StylesService = (params?: StylesServiceProps) => Styles;

export interface MUIStyles {
    [key: string]: MUISxProps<Theme>;
}

export type MUIStylesService = (theme?: StylesServiceProps) => MUIStyles;
