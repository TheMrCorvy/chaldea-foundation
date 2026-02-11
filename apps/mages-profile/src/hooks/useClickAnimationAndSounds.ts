"use client";

import { useSound } from "@/contexts/SoundContext";
import { useCallback, useEffect } from "react";

const useClickAnimationAndSounds = () => {
    const { playSound } = useSound();

    const handleClick = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (target.closest("[data-sound-toggle]")) {
                playSound("page_change");
                return;
            }

            if (target.closest('[data-sound="modal"]')) {
                playSound("modal");
                return;
            }

            if (target.closest('[data-sound="page_change"]')) {
                playSound("page_change");
                return;
            }

            playSound("button");
        },
        [playSound]
    );

    useEffect(() => {
        const clickEffect = (e: MouseEvent): void => {
            const d = document.createElement("div");
            d.className = "clickEffect";
            d.style.top = `${e.clientY}px`;
            d.style.left = `${e.clientX}px`;
            d.setAttribute("data-sound", "modal");
            document.body.appendChild(d);
            d.addEventListener("animationend", () => {
                d.parentElement?.removeChild(d);
            });

            handleClick(e);
        };

        document.addEventListener("click", clickEffect);

        return () => {
            document.removeEventListener("click", clickEffect);
        };
    }, [handleClick]);
};

export default useClickAnimationAndSounds;
