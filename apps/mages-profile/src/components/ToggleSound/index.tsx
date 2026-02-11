"use client";

import React from "react";
import { useSound } from "@/contexts/SoundContext";
import GlitchButton from "../GlitchButton";

const ToggleSound: React.FC = () => {
    const { soundEnabled, setSoundEnabled, playSound } = useSound();

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
