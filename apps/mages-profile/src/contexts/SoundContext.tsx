"use client";

import {
    createContext,
    useState,
    useContext,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    Dispatch,
    SetStateAction,
    ReactNode,
    FC,
} from "react";
import { usePathname } from "next/navigation";
import { logData } from "@repo/shared-utils/log-data";

export type SoundType = "button" | "modal" | "page_change";

interface SoundContextType {
    soundEnabled: boolean;
    setSoundEnabled: Dispatch<SetStateAction<boolean>>;
    playSound: (sound: SoundType) => void;
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
    const soundEnabledRef = useRef(soundEnabled);
    const sounds = useRef<{ [key: string]: HTMLAudioElement | null }>({
        button: null,
        modal: null,
        page_change: null,
        bgm: null,
    });
    const isInitialPageLoad = useRef(true);

    useEffect(() => {
        soundEnabledRef.current = soundEnabled;
    }, [soundEnabled]);

    const playSound = useCallback((sound: SoundType) => {
        if (soundEnabledRef.current) {
            const audio = sounds.current[sound];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch((error) => {
                    logData({
                        title: `Error playing sound: ${sound}`,
                        data: error,
                        layer: "client_access",
                        type: "error",
                        addSeparatorAfter: true,
                        addSpaceAfter: true,
                        timeStamp: true,
                    });
                });
            }
        }
    }, []);

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
                    logData({
                        title: "Error playing background music",
                        data: error,
                        layer: "client_access",
                        type: "error",
                        addSeparatorAfter: true,
                        addSpaceAfter: true,
                        timeStamp: true,
                    });
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

        logData({
            title: "Setting up background music",
            data: { bgm },
            layer: "client_access",
            type: "log",
            addSeparatorAfter: true,
            addSpaceAfter: true,
            timeStamp: true,
        });

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

    const value = useMemo(
        () => ({
            soundEnabled,
            setSoundEnabled,
            playSound,
        }),
        [soundEnabled, playSound]
    );

    return (
        <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
    );
};
