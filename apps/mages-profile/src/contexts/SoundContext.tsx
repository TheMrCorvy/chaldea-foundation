"use client";

import {
    createContext,
    useState,
    useContext,
    useRef,
    useEffect,
    Dispatch,
    SetStateAction,
    ReactNode,
    FC,
} from "react";
import { usePathname } from "next/navigation";

export type SoundType = "button" | "modal" | "page_change";

interface SoundContextType {
    soundEnabled: boolean;
    setSoundEnabled: Dispatch<SetStateAction<boolean>>;
    playSound: (sound: SoundType) => void;
    // setBgm: (bgm: BGMs) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export enum BGMs {
    ORDEAL_CALL = "ordeal_call",
    CLASS_SCORE = "class_score",
}

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
};

export interface SoundProviderProps {
    children: ReactNode;
    bgm?: BGMs;
}

export const SoundProvider: FC<SoundProviderProps> = ({ children, bgm }) => {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const pathname = usePathname();
    const sounds = useRef<{ [key: string]: HTMLAudioElement | null }>({
        button: null,
        modal: null,
        page_change: null,
        bgm: null,
    });
    const isInitialPageLoad = useRef(true);

    // const setBgm = (bgm: BGMs) => {
    //     if (sounds.current.bgm) {
    //         sounds.current.bgm.pause();
    //         sounds.current.bgm.currentTime = 0;
    //     }
    //     sounds.current.bgm = new Audio(`/assets/sounds/${bgm}.mp3`);
    //     sounds.current.bgm.volume = 0.2;
    //     sounds.current.bgm.loop = true;
    //     if (soundEnabled) {
    //         sounds.current.bgm.play().catch((error) => {
    //             console.error("Error playing background music", error);
    //         });
    //     }
    // };

    const playSound = (sound: SoundType) => {
        if (soundEnabled) {
            const audio = sounds.current[sound];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch((error) => {
                    console.error(`Error playing sound: ${sound}`, error);
                });
            }
        }
    };

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

    useEffect(() => {
        const currentSounds = sounds.current;

        currentSounds.button = new Audio("/assets/sounds/button.wav");
        currentSounds.button.volume = 0.2;

        currentSounds.modal = new Audio("/assets/sounds/modal.wav");
        currentSounds.modal.volume = 0.5;

        currentSounds.page_change = new Audio("/assets/sounds/page_change.wav");
        currentSounds.page_change.volume = 0.2;

        console.log("Setting up background music with bgm:", bgm);

        currentSounds.bgm = new Audio(
            `/assets/sounds/${bgm || "ordeal_call"}.mp3`
        );
        currentSounds.bgm.volume = bgm === BGMs.CLASS_SCORE ? 0.3 : 0.2;
        currentSounds.bgm.loop = true;

        return () => {
            Object.values(currentSounds).forEach((audio) => {
                audio?.pause();
                audio?.remove();
            });
        };
    }, [bgm]);

    const value = {
        soundEnabled,
        setSoundEnabled,
        playSound,
        // setBgm,
    };

    return (
        <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
    );
};
