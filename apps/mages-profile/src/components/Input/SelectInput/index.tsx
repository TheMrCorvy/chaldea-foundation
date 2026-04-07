import { InputAdornment, MenuItem, TextField } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";
import IconComponent, { IconName } from "@/components/IconComponent";

export type SelectInputProps = BaseInputProps<"select", string>;

const SelectInput: FC<SelectInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
    required,
    helper_text,
    size,
    placeholder,
    start_icon,
    end_icon,
}) => {
    const { hologramControl } = useStyles();
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <TextField
                fullWidth
                select
                placeholder={placeholder || ""}
                variant="outlined"
                name={field.name}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
                helperText={helper_text}
                sx={hologramControl}
                size={size || "medium"}
                SelectProps={{
                    MenuProps: {
                        sx: {
                            zIndex: 9999,
                        },
                        PaperProps: {
                            sx: {
                                zIndex: 9999,
                            },
                        },
                    },
                }}
                slotProps={{
                    input: {
                        endAdornment: end_icon && (
                            <InputAdornment position="end">
                                <IconComponent
                                    name={end_icon.name as IconName}
                                    size={end_icon.size || "medium"}
                                    color={end_icon.color || "inherit"}
                                />
                            </InputAdornment>
                        ),
                        startAdornment: start_icon && (
                            <InputAdornment position="start">
                                <IconComponent
                                    name={start_icon.name as IconName}
                                    size={start_icon.size || "medium"}
                                    color={start_icon.color || "inherit"}
                                />
                            </InputAdornment>
                        ),
                    },
                }}
            >
                {(field.option ?? []).map((option) => (
                    <MenuItem key={option.component_id} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </HologramInputFrame>
    );
};

export default SelectInput;
