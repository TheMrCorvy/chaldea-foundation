import {
    startTransition,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useInView } from "framer-motion";

export interface UseGlitchTextProps {
    text: string;
    delay?: number;
    disableHover?: boolean;
    characters: string;
    cycles?: number;
}

const useGlitchText = ({
    text,
    delay,
    disableHover,
    characters,
    cycles = 1,
}: UseGlitchTextProps) => {
    const [string, setString] = useState<string>(text);
    const [isIterating, setIsIterating] = useState(false);
    const iterationsRef = useRef<number>(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const hasStartedRef = useRef<boolean>(false);
    const isInView = useInView(elementRef, { once: true });

    const generateRandomText = useCallback(() => {
        const newString = text
            .split("")
            .map((_, index) => {
                const limit = Math.floor(iterationsRef.current / cycles);
                if (!iterationsRef.current || index < limit) {
                    return text[index];
                }

                return characters[
                    Math.floor(Math.random() * characters.length)
                ];
            })
            .join("");

        return newString;
    }, [characters, text, cycles]);

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

            if (iterationsRef.current >= text.length * cycles) {
                clearInterval(intervalId);
                setIsIterating(false);
                iterationsRef.current = 0;
            }
        }, 50);

        return intervalId;
    }, [text, generateRandomText, cycles]);

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

    return {
        string,
        handleHover,
        elementRef,
    };
};

export default useGlitchText;
