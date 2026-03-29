import { MenuItem, TextField } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";
import useStyles from "../useStyles";

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
}) => {
    const { hologramControl } = useStyles();
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <TextField
                fullWidth
                select
                variant="outlined"
                name={field.name}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                required={required}
                helperText={helper_text}
                sx={hologramControl}
                size={size}
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
