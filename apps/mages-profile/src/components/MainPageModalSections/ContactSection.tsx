"use client";

import { Box, Typography } from "@mui/material";
import { SectionsContactSection } from "@repo/type-definitions/dynamic-page";
import { FC, ChangeEvent, useEffect, useMemo, useState } from "react";
import { InputByType, RangeInputValue } from "../Input";
import { logData } from "@salvatore.hakase/log-data";

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

export interface ContactSectionProps extends SectionsContactSection {
    isMobile?: boolean;
}

const ContactSection: FC<ContactSectionProps> = ({
    contact_form,
    component_id,
    isMobile,
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

    const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch(contact_form.action, {
            method: contact_form.method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        }).catch((error) => {
            logData({
                title: "Error submitting contact form",
                data: error,
                layer: "internal_http_requests",
                type: "error",
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });
        });

        const res = await response?.json().catch((error) => {
            logData({
                title: "Error parsing contact form response",
                data: error,
                layer: "internal_http_requests",
                type: "error",
                addSeparatorAfter: true,
                addSpaceAfter: true,
                timeStamp: true,
            });
        });

        setSubmitted(true);
        logData({
            title: "Contact form submitted",
            data: {
                endpoint: contact_form.action,
                method: contact_form.method,
                values: formValues,
                response: res,
            },
            layer: "internal_http_requests",
            type: "info",
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });
    };

    return (
        <Box
            component="section"
            id={component_id}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                    px: "11px",
                    py: "4%",
                    maxHeight: isMobile ? "65dvh" : "54dvh",
                    overflowY: "auto",
                    overflowX: "hidden",
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
                            size={input.size || "medium"}
                            placeholder={input.placeholder}
                            start_icon={input.start_icon}
                            end_icon={input.end_icon}
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
                        Transmission sent!
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ContactSection;
