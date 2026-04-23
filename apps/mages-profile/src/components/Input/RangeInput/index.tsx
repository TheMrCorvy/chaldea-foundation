import { Slider, Typography } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";

export type RangeInputValue = [number, number];

export type RangeInputProps = BaseInputProps<"range", RangeInputValue> & {
    min?: number;
    max?: number;
    step?: number;
};

const RangeInput: FC<RangeInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
    min = 0,
    max = 100,
    step = 1,
    size,
    required,
}) => {
    const { hologramSlider } = useStyles();
    return (
        <HologramInputFrame
            label={label ?? field.name}
            disabled={disabled}
            required={required}
        >
            <Typography
                variant="caption"
                sx={{ color: "rgba(214, 239, 255, 0.88)", mb: 0.4 }}
            >
                {`${value[0]} - ${value[1]}`}
            </Typography>
            <Slider
                value={value}
                onChange={(_event, newValue) => {
                    if (Array.isArray(newValue) && newValue.length === 2) {
                        onChange([newValue[0], newValue[1]]);
                    }
                }}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                valueLabelDisplay="auto"
                sx={hologramSlider}
                size={size || "medium"}
            />
        </HologramInputFrame>
    );
};

export default RangeInput;
