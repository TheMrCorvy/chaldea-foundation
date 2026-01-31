import { useState, useEffect } from "react";

export type Breakpoints = "xs" | "sm" | "md" | "lg" | "xl";
export type BreakpointValues = Record<Breakpoints, number>;

export const breakpoints: BreakpointValues = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
};

export interface MaxMinParams {
    breakpoint: Breakpoints;
    maxMin: "max" | "min";
}

export const useMediaQuery = () => {
    const [query, setQuery] = useState<string>();
    const [matches, setMatches] = useState(false);

    const handler = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
    };

    const width = (params: MaxMinParams) => {
        const q = `(${params.maxMin}-width: ${breakpoints[params.breakpoint]}px)`;
        if (q === query) {
            return matches;
        }
        setQuery(q);

        return matches;
    };

    const height = (params: MaxMinParams) => {
        const q = `(${params.maxMin}-height: ${breakpoints[params.breakpoint]}px)`;
        if (q === query) {
            return matches;
        }
        setQuery(q);

        return matches;
    };

    useEffect(() => {
        if (!query) {
            return;
        }

        const mediaQuery = window.matchMedia(query);
        mediaQuery.addEventListener("change", handler);

        setMatches(mediaQuery.matches); // Initial state will not be set to true if it matches, only on change, so we have to set it up like this first

        return () => mediaQuery.removeEventListener("change", handler);
    }, [query]);

    return {
        min: {
            width: (b: Breakpoints) => width({ maxMin: "min", breakpoint: b }),
            height: (b: Breakpoints) =>
                height({ maxMin: "min", breakpoint: b }),
        },
        max: {
            width: (b: Breakpoints) => width({ maxMin: "max", breakpoint: b }),
            height: (b: Breakpoints) =>
                height({ maxMin: "max", breakpoint: b }),
        },
    };
};
