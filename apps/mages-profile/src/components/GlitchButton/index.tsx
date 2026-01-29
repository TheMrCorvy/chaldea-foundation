"use client";

import { FC } from "react";
import styles from "./GlitchButton.module.css";

export interface GlitchButtonProps {
    label: string;
    onClick?: (params?: unknown) => void;
    id?: string;
    dataAction?: string;
    cornerVariant?: "right" | "left";
}

const GlitchButton: FC<GlitchButtonProps> = ({
    label,
    onClick,
    id,
    dataAction,
    cornerVariant = "left",
}) => {
    const buttonClasses = `${styles.cyberBtn} ${styles[cornerVariant]}`;

    return (
        <button
            className={buttonClasses}
            id={id}
            data-action={dataAction}
            onClick={onClick}
        >
            <span className={styles.backdrop}>
                <span className={styles.corner}></span>
            </span>
            <span>{label}</span>
            <div className={styles.glitch} aria-hidden="true">
                <span className={styles.backdrop}>
                    <span className={styles.corner}></span>
                </span>
                <span className={styles.letters}>
                    {label.split("").map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </span>
            </div>
        </button>
    );
};

export default GlitchButton;
