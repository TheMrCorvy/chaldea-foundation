"use client";

import { Box, Typography } from "@mui/material";
import { SectionsContactSection } from "@repo/type-definitions/dynamic-page";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { InputByType, RangeInputValue } from "../Input";

type ContactFieldValue = string | number | RangeInputValue;

type ContactFieldState = Record<string, ContactFieldValue>;

const parseNumber = (value: string | null | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const parseRange = (value: string | null | undefined): RangeInputValue => {
    if (!value) {
        return [0, 100];
    }

    const parsedValues = value
        .split(/[-,]/)
        .map((chunk) => chunk.trim())
        .map(Number)
        .filter((chunk) => Number.isFinite(chunk));

    if (parsedValues.length >= 2) {
        return [parsedValues[0], parsedValues[1]];
    }

    return [0, 100];
};

const getInitialFieldValue = (
    input: SectionsContactSection["contact_form"]["inputs"][number]
): ContactFieldValue => {
    if (input.type === "slider") {
        return parseNumber(input.default_value, 0);
    }

    if (input.type === "range") {
        return parseRange(input.default_value);
    }

    if (input.type === "select") {
        return input.default_value ?? input.option?.[0]?.value ?? "";
    }

    if (input.type === "submit") {
        return input.default_value ?? input.label ?? input.name ?? "Send";
    }

    return input.default_value ?? "";
};

const ContactSection: FC<SectionsContactSection> = ({
    contact_form,
    component_id,
}) => {
    const initialValues = useMemo<ContactFieldState>(() => {
        return contact_form.inputs.reduce<ContactFieldState>((acc, input) => {
            acc[input.name] = getInitialFieldValue(input);
            return acc;
        }, {});
    }, [contact_form.inputs]);

    const [formValues, setFormValues] =
        useState<ContactFieldState>(initialValues);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleInputChange = (name: string, value: ContactFieldValue) => {
        setSubmitted(false);
        setFormValues((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <Box
            component="section"
            id={component_id}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                overflow: "auto",
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    px: "11px",
                    py: "4%",
                    "&::-webkit-scrollbar": { width: "1%" },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(127, 214, 255, 0.45)",
                        borderRadius: "999px",
                    },
                }}
            >
                {contact_form.inputs.map((input, index) => (
                    <Box
                        key={`${input.component_id}-${index}`}
                        sx={{
                            width: "100%",
                        }}
                    >
                        <InputByType
                            field={input}
                            value={
                                formValues[input.name] ??
                                getInitialFieldValue(input)
                            }
                            onChange={(value) =>
                                handleInputChange(input.name, value)
                            }
                            label={input.label ?? input.name}
                            required={input.required}
                            disabled={input.disabled}
                            helper_text={input.helper_text}
                        />
                    </Box>
                ))}

                {submitted && (
                    <Typography
                        variant="caption"
                        sx={{
                            width: "100%",
                            color: "rgba(146, 232, 255, 0.95)",
                            textAlign: "center",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                        }}
                    >
                        Transmission queued
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ContactSection;
