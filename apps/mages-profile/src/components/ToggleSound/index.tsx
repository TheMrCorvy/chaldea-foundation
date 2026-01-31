"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Switch } from "@mui/material";
import { usePathname } from "next/navigation";

const ToggleSound: React.FC = () => {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const pathname = usePathname();
    const isInitialPageLoad = useRef(true);

    const sounds = useRef<{ [key: string]: HTMLAudioElement | null }>({
        button: null,
        modal: null,
        page_change: null,
    });

    useEffect(() => {
        // Preload sounds
        sounds.current.button = new Audio("/assets/sounds/button.wav");
        sounds.current.modal = new Audio("/assets/sounds/modal.wav");
        sounds.current.page_change = new Audio(
            "/assets/sounds/page_change.wav"
        );
    }, []);

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

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (target.closest("[data-sound-toggle]")) {
                return;
            }

            if (target.closest('[data-sound="modal"]')) {
                playSound("modal");
                return;
            }

            if (
                target.closest(
                    'a, button, [role="button"], input, label, [data-mui-internal-clone-element]'
                )
            ) {
                playSound("button");
            }
        };

        if (soundEnabled) {
            document.addEventListener("click", handleClick, true);
        }

        return () => {
            document.removeEventListener("click", handleClick, true);
        };
    }, [soundEnabled, playSound]);

    useEffect(() => {
        if (isInitialPageLoad.current) {
            isInitialPageLoad.current = false;
            return;
        }
        if (soundEnabled) {
            playSound("page_change");
        }
    }, [pathname, playSound, soundEnabled]);

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSoundEnabled(event.target.checked);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 16,
                left: 16,
            }}
            data-sound-toggle="modal"
        >
            <Switch
                checked={soundEnabled}
                onChange={handleToggle}
                color="primary"
            />
        </Box>
    );
};

export default ToggleSound;
