import { SxProps } from "@mui/joy/styles/types";

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
