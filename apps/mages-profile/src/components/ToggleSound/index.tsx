"use client";

import { BGMs, useSound } from "@/contexts/SoundContext";
import GlitchButton from "../GlitchButton";
import { FC, useEffect } from "react";

export interface ToggleSoundProps {
    bgm?: BGMs;
}

const ToggleSound: FC<ToggleSoundProps> = ({ bgm }) => {
    const { soundEnabled, setSoundEnabled, playSound } = useSound();

    // useEffect(() => {
    //     if (bgm) {
    //         setBgm(bgm);
    //     }
    // }, [bgm, setBgm]);

    const handleClick = () => {
        playSound("page_change");
        setSoundEnabled(!soundEnabled);
    };

    return (
        <GlitchButton
            label="Sound Effects"
            cornerVariant="right"
            active={soundEnabled}
            onClick={handleClick}
            dataSound="page_change"
        />
    );
};

export default ToggleSound;
