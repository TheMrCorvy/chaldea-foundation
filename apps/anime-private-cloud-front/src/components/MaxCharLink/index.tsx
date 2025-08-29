"use client";

import { FC, useState, useEffect } from "react";

import { Link } from "@nextui-org/link";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

export interface Props {
    url: string;
    label: string;
    maxLength?: number;
    popoverPlacement?:
        | "top-start"
        | "top"
        | "top-end"
        | "bottom-start"
        | "bottom"
        | "bottom-end"
        | "right-start"
        | "right"
        | "right-end"
        | "left-start"
        | "left"
        | "left-end";
    className?: string;
}

const MaxCharLink: FC<Props> = ({
    url,
    label,
    maxLength,
    popoverPlacement,
    className,
}) => {
    const maxCharacters = maxLength || 20;
    const [isOpen, setIsOpen] = useState(false);
    const [linkLabel, setLinkLabel] = useState("");

    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    useEffect(() => {
        if (label.length >= maxCharacters) {
            const lastIndex = maxCharacters - 3 >= 1 ? maxCharacters - 3 : 1;
            setLinkLabel(label.substring(0, lastIndex) + "...");
        }
    }, [label, maxCharacters]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;
        if (isOpen) {
            timeout = setTimeout(() => setIsOpen(false), 3500);
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [isOpen]);

    if (label.length < maxCharacters && !linkLabel) {
        return (
            <Link
                href={url}
                className={className}
                data-testid="max-char-link-complete"
            >
                {label}
            </Link>
        );
    }

    return (
        <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Popover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                color="primary"
                placement={popoverPlacement}
            >
                <PopoverTrigger>
                    <Link
                        href={url}
                        className={className}
                        data-testid="max-char-link-truncated"
                    >
                        {linkLabel}
                    </Link>
                </PopoverTrigger>
                <PopoverContent>
                    <p
                        className={className}
                        data-testid="max-char-link-popover"
                    >
                        {label}
                    </p>
                </PopoverContent>
            </Popover>
        </span>
    );
};

export default MaxCharLink;
