import { Typography, TypographyProps } from "@mui/material";
import { FC, ReactNode } from "react";
import styles from "./HologramGlitchText.module.css";

export interface GlitchTextProps extends TypographyProps {
    children?: ReactNode;
}

const HologramGlitchText: FC<GlitchTextProps> = ({ children, ...rest }) => {
    return (
        <Typography {...rest} className={styles.glitch} data-text={children}>
            {children}
        </Typography>
    );
};

export default HologramGlitchText;
