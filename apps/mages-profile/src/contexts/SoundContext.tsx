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
import { logData } from "@salvatore.hakase/log-data";

export type SoundType = "button" | "modal" | "page_change";

interface SoundContextType {
    soundEnabled: boolean;
    setSoundEnabled: Dispatch<SetStateAction<boolean>>;
    playSound: (sound: SoundType) => void;
    bgmVolume: number;
    setBgmVolume: Dispatch<SetStateAction<number>>;
    sfxVolume: number;
    setSfxVolume: Dispatch<SetStateAction<number>>;
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
    const [bgmVolume, setBgmVolume] = useState(0.3);
    const [sfxVolume, setSfxVolume] = useState(0.2);
    const pathname = usePathname();
    const soundEnabledRef = useRef(soundEnabled);
    const sfxVolumeRef = useRef(sfxVolume);
    const bgmVolumeRef = useRef(bgmVolume);
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

    useEffect(() => {
        sfxVolumeRef.current = sfxVolume;
    }, [sfxVolume]);

    useEffect(() => {
        bgmVolumeRef.current = bgmVolume;
    }, [bgmVolume]);

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
        const currentBgm = sounds.current.bgm;
        if (currentBgm) {
            const baseVolume = bgm === BGMs.CLASS_SCORE ? 0.6 : 0.4;
            currentBgm.volume = bgmVolume * baseVolume;
        }
    }, [bgmVolume, bgm]);

    useEffect(() => {
        const currentSounds = sounds.current;
        if (currentSounds.button) {
            currentSounds.button.volume = sfxVolume * 0.4;
        }
        if (currentSounds.modal) {
            currentSounds.modal.volume = sfxVolume * 1.0;
        }
        if (currentSounds.page_change) {
            currentSounds.page_change.volume = sfxVolume * 0.4;
        }
    }, [sfxVolume]);

    useEffect(() => {
        const currentSounds = sounds.current;

        currentSounds.button = new Audio("/assets/sounds/button.wav");
        currentSounds.button.volume = sfxVolumeRef.current * 0.4;

        currentSounds.modal = new Audio("/assets/sounds/modal.wav");
        currentSounds.modal.volume = sfxVolumeRef.current * 1.0;

        currentSounds.page_change = new Audio("/assets/sounds/page_change.wav");
        currentSounds.page_change.volume = sfxVolumeRef.current * 0.4;

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
        const baseVolume = bgm === BGMs.CLASS_SCORE ? 0.6 : 0.4;
        currentSounds.bgm.volume = bgmVolumeRef.current * baseVolume;
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
            bgmVolume,
            setBgmVolume,
            sfxVolume,
            setSfxVolume,
        }),
        [soundEnabled, playSound, bgmVolume, sfxVolume]
    );

    return (
        <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
    );
};
