import { TextField } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";

export type TextareaInputProps = BaseInputProps<"textarea", string> & {
    rows?: number;
    placeholder?: string;
};

const TextareaInput: FC<TextareaInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
    required,
    helper_text,
    rows = 4,
    placeholder,
}) => {
    const { hologramControl } = useStyles();
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <TextField
                fullWidth
                multiline
                rows={rows}
                variant="outlined"
                name={field.name}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
                helperText={helper_text}
                sx={hologramControl}
            />
        </HologramInputFrame>
    );
};

export default TextareaInput;
