import { InputAdornment, TextField } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";
import { AccountCircle } from "@mui/icons-material";
import IconComponent, { IconName } from "@/components/IconComponent";
import { start } from "repl";

export type TextInputProps = BaseInputProps<"input", string>;

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
    start_icon,
    end_icon,
}) => {
    const { hologramControl } = useStyles();
    console.log({ start_icon, end_icon });
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <TextField
                fullWidth
                variant="outlined"
                name={field.name}
                value={value}
                placeholder={placeholder || ""}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
                helperText={helper_text}
                sx={hologramControl}
                size={size || "medium"}
                slotProps={{
                    input: {
                        endAdornment: end_icon && (
                            <InputAdornment position="end">
                                <IconComponent
                                    icon={end_icon.name as IconName}
                                    size={end_icon.size || "medium"}
                                    color={end_icon.color || "inherit"}
                                />
                            </InputAdornment>
                        ),
                        startAdornment: start_icon && (
                            <InputAdornment position="start">
                                <IconComponent
                                    icon={start_icon.name as IconName}
                                    size={start_icon.size || "medium"}
                                    color={start_icon.color || "inherit"}
                                />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </HologramInputFrame>
    );
};

export default TextInput;
