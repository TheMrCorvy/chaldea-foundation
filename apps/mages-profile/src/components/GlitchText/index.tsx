import { Typography } from "@mui/material";
import { FC } from "react";
import { TypographyProps } from "@mui/material/Typography";
import useGlitchText from "./useGlitchText";
import useRandomString from "@/hooks/useRandomString";

export interface GlitchTextProps extends TypographyProps {
    text: string;
    useMayus?: boolean;
    useNumbers?: boolean;
    useMinus?: boolean;
    useSymbols?: boolean;
    delay?: number;
    disableHover?: boolean;
}

const GlitchText: FC<GlitchTextProps> = ({
    text,
    useMayus = true,
    useMinus = true,
    useNumbers = true,
    useSymbols = false,
    delay = 0,
    disableHover = true,
    ...props
}) => {
    const characters = useRandomString({
        useMayus,
        useMinus,
        useNumbers,
        useSymbols,
    }).build();

    const { string, handleHover, elementRef } = useGlitchText({
        text,
        disableHover,
        delay,
        characters,
    });

    return (
        <Typography
            {...props}
            ref={elementRef}
            onMouseEnter={handleHover}
            sx={{
                ...props.sx,
                wordBreak: "break-word",
            }}
        >
            {string}
        </Typography>
    );
};

export default GlitchText;
