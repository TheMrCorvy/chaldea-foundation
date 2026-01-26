import { Typography } from "@mui/material";
import {
    FC,
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useInView } from "motion/react";
import { TypographyProps } from "@mui/material/Typography";

export interface GlitchTextProps extends TypographyProps {
    text: string;
    useMayus?: boolean;
    useNumbers?: boolean;
    useMinus?: boolean;
    useSymbols?: boolean;
    delay?: number;
    disableHover?: boolean;
}

const GlitchText: FC<GlitchTextProps> = ({
    text,
    useMayus = true,
    useMinus = true,
    useNumbers = true,
    useSymbols = false,
    delay = 0,
    disableHover = true,
    ...props
}) => {
    const [string, setString] = useState<string>(text);
    const [isIterating, setIsIterating] = useState(false);
    const iterationsRef = useRef<number>(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const hasStartedRef = useRef<boolean>(false);
    const isInView = useInView(elementRef, { once: true });

    const buildLettersString = useCallback(() => {
        let result: string = "";

        const mayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const minus = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";

        if (useMayus) {
            result += mayus;
        }

        if (useMinus) {
            result += minus;
        }

        if (useNumbers) {
            result += numbers;
        }

        if (useSymbols) {
            result += symbols;
        }

        return result;
    }, [useMayus, useMinus, useNumbers, useSymbols]);

    const generateRandomText = useCallback(() => {
        const characters = buildLettersString();

        const newString = text
            .split("")
            .map((_, index) => {
                if (!iterationsRef.current || index < iterationsRef.current) {
                    return text[index];
                }

                return characters[
                    Math.floor(Math.random() * characters.length)
                ];
            })
            .join("");

        return newString;
    }, [buildLettersString, text]);

    const handleHover = () => {
        if (isIterating || disableHover) return;

        const newString = generateRandomText();
        setString(newString);

        setIsIterating(true);
    };

    const handleInterval = useCallback(() => {
        const intervalId = setInterval(() => {
            iterationsRef.current += 1;
            setString(generateRandomText());

            if (iterationsRef.current >= text.length) {
                clearInterval(intervalId);
                setIsIterating(false);
                iterationsRef.current = 0;
            }
        }, 50);

        return intervalId;
    }, [text, generateRandomText]);

    useEffect(() => {
        if (!isIterating) {
            iterationsRef.current = 0;
            return;
        }

        const intervalId = handleInterval();

        return () => {
            clearInterval(intervalId);
        };
    }, [isIterating, handleInterval]);

    useEffect(() => {
        if (isInView && !hasStartedRef.current) {
            hasStartedRef.current = true;

            if (delay !== undefined && delay !== 0) {
                const timeoutId = setTimeout(() => {
                    startTransition(() => {
                        setIsIterating(true);
                    });
                }, delay * 1000);

                return () => {
                    clearTimeout(timeoutId);
                };
            }

            startTransition(() => {
                setIsIterating(true);
            });
        }
    }, [isInView, delay]);

    return (
        <Typography {...props} ref={elementRef} onMouseEnter={handleHover}>
            {string}
        </Typography>
    );
};

export default GlitchText;
