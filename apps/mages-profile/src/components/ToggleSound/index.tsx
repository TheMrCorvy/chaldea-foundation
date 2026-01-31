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
        bgm: null,
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

            if (target.closest('[data-sound="page_change"]')) {
                playSound("page_change");
                return;
            }

            playSound("button");
        },
        [playSound]
    );

    useEffect(() => {
        const currentSounds = sounds.current;

        // Preload sounds
        currentSounds.button = new Audio("/assets/sounds/button.wav");
        currentSounds.button.volume = 0.2;

        currentSounds.modal = new Audio("/assets/sounds/modal.wav");
        currentSounds.modal.volume = 0.5;

        currentSounds.page_change = new Audio("/assets/sounds/page_change.wav");
        currentSounds.page_change.volume = 0.2;

        currentSounds.bgm = new Audio("/assets/sounds/bgm.mp3");
        currentSounds.bgm.volume = 0.2;
        currentSounds.bgm.loop = true;

        return () => {
            // Cleanup
            Object.values(currentSounds).forEach((audio) => {
                audio?.pause();
                audio?.remove();
            });
        };
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
            document.addEventListener("click", handleClick);
        }

        return () => {
            document.removeEventListener("click", handleClick);
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

    useEffect(() => {
        const bgm = sounds.current.bgm;
        if (bgm) {
            if (soundEnabled) {
                bgm.play().catch((error) => {
                    console.error("Error playing background music", error);
                });
            } else {
                bgm.pause();
                bgm.currentTime = 0;
            }
        }
    }, [soundEnabled]);

    return (
        <GlitchButton
            label="Sound Effects"
            cornerVariant="right"
            active={soundEnabled}
            onClick={() => setSoundEnabled(!soundEnabled)}
            dataSound="page_change"
        />
    );
};

export default ToggleSound;
