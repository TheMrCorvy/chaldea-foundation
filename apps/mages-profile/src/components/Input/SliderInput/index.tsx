import { Slider, Typography } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";

export type SliderInputProps = BaseInputProps<"slider", number> & {
    min?: number;
    max?: number;
    step?: number;
};

const SliderInput: FC<SliderInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
    min = 0,
    max = 100,
    step = 1,
    size,
}) => {
    const { hologramSlider } = useStyles();
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <Typography
                variant="caption"
                sx={{ color: "rgba(214, 239, 255, 0.88)", mb: 0.4 }}
            >
                {value}
            </Typography>
            <Slider
                value={value}
                onChange={(_event, newValue) => {
                    if (typeof newValue === "number") {
                        onChange(newValue);
                    }
                }}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                valueLabelDisplay="auto"
                sx={hologramSlider}
                size={size}
            />
        </HologramInputFrame>
    );
};

export default SliderInput;
