"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import GlitchButton from "../GlitchButton";

const ToggleSound: React.FC = () => {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const pathname = usePathname();
    const isInitialPageLoad = useRef(true);

    const sounds = useRef<{ [key: string]: HTMLAudioElement | null }>({
        button: null,
        modal: null,
        page_change: null,
    });

    const playSound = useCallback(
        (sound: "button" | "modal" | "page_change") => {
            if (soundEnabled) {
                const audio = sounds.current[sound];
                if (audio) {
                    audio.currentTime = 0; // Rewind to start
                    audio.play().catch((error) => {
                        // Autoplay was prevented.
                        console.error(`Error playing sound: ${sound}`, error);
                    });
                }
            }
        },
        [soundEnabled]
    );

    const handleClick = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (target.closest("[data-sound-toggle]")) {
                return;
            }

            if (target.closest('[data-sound="modal"]')) {
                playSound("modal");
                return;
            }

            playSound("button");
        },
        [playSound]
    );

    useEffect(() => {
        // Preload sounds
        sounds.current.button = new Audio("/assets/sounds/button.wav");
        sounds.current.button.volume = 0.2;
        sounds.current.modal = new Audio("/assets/sounds/modal.wav");
        sounds.current.modal.volume = 0.5;
        sounds.current.page_change = new Audio(
            "/assets/sounds/page_change.wav"
        );
        sounds.current.page_change.volume = 0.2;
    }, []);

    useEffect(() => {
        // Add click animations
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
    }, [playSound, soundEnabled, handleClick]);

    useEffect(() => {
        if (soundEnabled) {
            document.addEventListener("click", handleClick, true);
        }

        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, [soundEnabled, playSound, handleClick]);

    useEffect(() => {
        if (isInitialPageLoad.current) {
            isInitialPageLoad.current = false;
            return;
        }
        if (soundEnabled) {
            playSound("page_change");
        }
    }, [pathname, playSound, soundEnabled]);

    return (
        <GlitchButton
            label="Sound Effects"
            cornerVariant="right"
            active={soundEnabled}
            onClick={() => setSoundEnabled(!soundEnabled)}
        />
    );
};

export default ToggleSound;
