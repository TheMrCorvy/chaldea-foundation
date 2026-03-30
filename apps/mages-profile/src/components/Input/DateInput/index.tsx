import { TextField } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";

export type DateInputProps = BaseInputProps<"date", string>;

const DateInput: FC<DateInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
    required,
    helper_text,
    size,
}) => {
    const { hologramControl } = useStyles();
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <TextField
                fullWidth
                type="date"
                variant="outlined"
                name={field.name}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
                helperText={helper_text}
                sx={hologramControl}
                size={size || "medium"}
            />
        </HologramInputFrame>
    );
};

export default DateInput;
