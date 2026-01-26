import { useCallback } from "react";

export interface UseRandomStringParams {
    useMayus?: boolean;
    useNumbers?: boolean;
    useMinus?: boolean;
    useSymbols?: boolean;
}

const useRandomString = ({
    useMayus,
    useMinus,
    useNumbers,
    useSymbols,
}: UseRandomStringParams) => {
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

    return {
        build: () => buildLettersString(),
    };
};

export default useRandomString;
