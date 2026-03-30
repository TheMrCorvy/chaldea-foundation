import { LayoutFormInput } from "@repo/type-definitions/dynamic-page";

export type InputType = LayoutFormInput["type"];

export type InputField<T extends InputType> = LayoutFormInput & {
    type: T;
};

type SharedInputFlags = Pick<
    LayoutFormInput,
    | "label"
    | "disabled"
    | "required"
    | "helper_text"
    | "size"
    | "placeholder"
    | "start_icon"
    | "end_icon"
>;

export interface BaseInputProps<
    T extends InputType,
    TValue,
> extends SharedInputFlags {
    field: InputField<T>;
    value: TValue;
    onChange: (value: TValue) => void;
}
