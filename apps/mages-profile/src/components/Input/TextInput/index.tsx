import { TextField } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";

export type TextInputProps = BaseInputProps<"input", string> & {
    placeholder?: string;
};

const TextInput: FC<TextInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
    required,
    placeholder,
    helper_text,
    size,
}) => {
    const { hologramControl } = useStyles();
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <TextField
                fullWidth
                variant="outlined"
                name={field.name}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
                helperText={helper_text}
                sx={hologramControl}
                size={size}
            />
        </HologramInputFrame>
    );
};

export default TextInput;
