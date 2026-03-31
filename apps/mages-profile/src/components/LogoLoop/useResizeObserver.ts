import { RefObject, useEffect } from "react";

export const useResizeObserver = (
    callback: () => void,
    elements: Array<RefObject<Element | null>>
) => {
    useEffect(() => {
        if (!window.ResizeObserver) {
            const handleResize = () => callback();
            window.addEventListener("resize", handleResize);
            callback();
            return () => window.removeEventListener("resize", handleResize);
        }

        const observers = elements.map((ref) => {
            if (!ref.current) return null;
            const observer = new ResizeObserver(callback);
            observer.observe(ref.current);
            return observer;
        });

        callback();

        return () => {
            observers.forEach((observer) => observer?.disconnect());
        };
    }, [callback, elements]);
};
