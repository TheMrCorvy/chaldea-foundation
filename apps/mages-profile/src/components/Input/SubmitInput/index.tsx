import { Button } from "@mui/material";
import { FC } from "react";
import HologramInputFrame from "../HologramInputFrame";
import { BaseInputProps } from "../types";

export type SubmitInputProps = BaseInputProps<"submit", string>;

const SubmitInput: FC<SubmitInputProps> = ({
    field,
    label,
    value,
    onChange,
    disabled,
}) => {
    return (
        <HologramInputFrame label={label ?? field.name} disabled={disabled}>
            <Button
                fullWidth
                type="submit"
                variant="outlined"
                color="primary"
                disabled={disabled}
                onClick={() => onChange(value)}
                sx={{
                    borderColor: "rgba(25,118,210, 0.6)",
                    color: "rgba(214, 239, 255, 0.95)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background:
                        "linear-gradient(90deg, rgba(15, 39, 73, 0.85), rgba(19, 61, 108, 0.75))",
                    "&:hover": {
                        borderColor: "rgba(127, 214, 255, 0.95)",
                        boxShadow: "0 0 14px rgba(56, 182, 255, 0.4)",
                    },
                }}
            >
                {value}
            </Button>
        </HologramInputFrame>
    );
};

export default SubmitInput;
