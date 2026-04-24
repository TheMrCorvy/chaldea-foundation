"use client";

import { Box, Typography } from "@mui/material";
import { LayoutForm } from "@repo/type-definitions/dynamic-page";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { InputByType, RangeInputValue } from "../../Input";
import { motion } from "framer-motion";
import DynamicTitle from "../DynamicTitle";

type FormFieldValue = string | number | RangeInputValue;
type FormFieldState = Record<string, FormFieldValue>;

const parseNumber = (value: string | null | undefined, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const parseRange = (value: string | null | undefined): RangeInputValue => {
    if (!value) return [0, 100];
    const parsedValues = value
        .split(/[-,]/)
        .map((chunk) => chunk.trim())
        .map(Number)
        .filter((chunk) => Number.isFinite(chunk));
    if (parsedValues.length >= 2) return [parsedValues[0], parsedValues[1]];
    return [0, 100];
};

const getInitialFieldValue = (
    input: LayoutForm["inputs"][number]
): FormFieldValue => {
    if (input.type === "slider") return parseNumber(input.default_value, 0);
    if (input.type === "range") return parseRange(input.default_value);
    if (input.type === "select")
        return input.default_value ?? input.option?.[0]?.value ?? "";
    if (input.type === "submit")
        return input.default_value ?? input.label ?? input.name ?? "Submit";
    return input.default_value ?? "";
};

const containerVariants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, filter: "blur(10px)", scale: 0.95 },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const DynamicForm: FC<LayoutForm> = ({
    inputs,
    action,
    method,
    component_id,
    title,
    id,
}) => {
    const initialValues = useMemo<FormFieldState>(() => {
        return inputs.reduce<FormFieldState>((acc, input) => {
            acc[input.name] = getInitialFieldValue(input);
            return acc;
        }, {});
    }, [inputs]);

    const [formValues, setFormValues] = useState<FormFieldState>(initialValues);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        setFormValues(initialValues);
    }, [initialValues]);

    const handleInputChange = (name: string, value: FormFieldValue) => {
        setSubmitted(false);
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch(action, {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        }).catch((error) => {
            console.error("Error submitting dynamic form:", error);
        });

        const res = await response?.json().catch((error) => {
            console.error("Error parsing response:", error);
        });

        setSubmitted(true);
        console.log("Form submission response:", res);
    };

    return (
        <Box
            component={motion.section}
            variants={containerVariants}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView="visible"
            id={component_id}
            sx={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            {title && (
                <DynamicTitle
                    title={title}
                    color={"#eeeeee"}
                    size="h4"
                    isMobile={false}
                    id={id}
                />
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    width: "100%",
                    mt: 6,
                }}
            >
                {inputs.map((input, index) => (
                    <Box
                        key={`${input.component_id}-${index}`}
                        component={motion.div}
                        variants={itemVariants}
                        sx={{ width: "100%" }}
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
                        component={motion.span}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        sx={{
                            width: "100%",
                            color: "rgba(146, 232, 255, 0.95)",
                            textAlign: "center",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            mt: 1,
                        }}
                    >
                        Transmission queued
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default DynamicForm;
