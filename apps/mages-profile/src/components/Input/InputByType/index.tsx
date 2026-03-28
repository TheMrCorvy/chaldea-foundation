import { FC } from "react";
import DateInput from "../DateInput";
import RangeInput, { RangeInputValue } from "../RangeInput";
import SelectInput from "../SelectInput";
import SliderInput from "../SliderInput";
import SubmitInput from "../SubmitInput";
import TextareaInput from "../TextareaInput";
import TextInput from "../TextInput";
import { InputField } from "../types";

type InputByTypeField =
    | InputField<"input">
    | InputField<"submit">
    | InputField<"textarea">
    | InputField<"select">
    | InputField<"date">
    | InputField<"slider">
    | InputField<"range">;

export interface InputByTypeProps {
    field: InputByTypeField;
    value: string | number | RangeInputValue;
    onChange: (value: string | number | RangeInputValue) => void;
    label?: string | null;
    disabled?: boolean;
    required?: boolean;
    helper_text?: string | null;
}

const InputByType: FC<InputByTypeProps> = ({
    field,
    value,
    onChange,
    label,
    disabled,
    required,
    helper_text,
}) => {
    const resolvedLabel = label ?? field.label ?? field.name;
    const resolvedDisabled = disabled ?? field.disabled ?? false;
    const resolvedRequired = required ?? field.required ?? false;
    const resolvedHelperText = helper_text ?? field.helper_text;

    switch (field.type) {
        case "input":
            return (
                <TextInput
                    field={field}
                    label={resolvedLabel}
                    value={typeof value === "string" ? value : String(value)}
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                    required={resolvedRequired}
                    helper_text={resolvedHelperText}
                />
            );

        case "textarea":
            return (
                <TextareaInput
                    field={field}
                    label={resolvedLabel}
                    value={typeof value === "string" ? value : String(value)}
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                    required={resolvedRequired}
                    helper_text={resolvedHelperText}
                />
            );

        case "select":
            return (
                <SelectInput
                    field={field}
                    label={resolvedLabel}
                    value={typeof value === "string" ? value : String(value)}
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                    required={resolvedRequired}
                    helper_text={resolvedHelperText}
                />
            );

        case "date":
            return (
                <DateInput
                    field={field}
                    label={resolvedLabel}
                    value={typeof value === "string" ? value : String(value)}
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                    required={resolvedRequired}
                    helper_text={resolvedHelperText}
                />
            );

        case "slider":
            return (
                <SliderInput
                    field={field}
                    label={resolvedLabel}
                    value={
                        typeof value === "number" ? value : Number(value) || 0
                    }
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                />
            );

        case "range": {
            const rangeValue =
                Array.isArray(value) && value.length === 2
                    ? value
                    : ([0, 100] as RangeInputValue);

            return (
                <RangeInput
                    field={field}
                    label={resolvedLabel}
                    value={rangeValue}
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                />
            );
        }

        case "submit":
            return (
                <SubmitInput
                    field={field}
                    label={resolvedLabel}
                    value={typeof value === "string" ? value : "Submit"}
                    onChange={(nextValue) => onChange(nextValue)}
                    disabled={resolvedDisabled}
                />
            );

        default:
            return null;
    }
};

export default InputByType;
