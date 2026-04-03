"use client";

import { useSound } from "@/contexts/SoundContext";
import GlitchButton from "../GlitchButton";
import { FC } from "react";

export interface ToggleSoundProps {
    useLeftSideBtn?: boolean;
}

const ToggleSound: FC<ToggleSoundProps> = ({ useLeftSideBtn }) => {
    const { soundEnabled, setSoundEnabled, playSound } = useSound();

    const handleClick = () => {
        playSound("page_change");
        setSoundEnabled(!soundEnabled);
    };

    return (
        <GlitchButton
            label="Sound Effects"
            cornerVariant={useLeftSideBtn ? "left" : "right"}
            active={soundEnabled}
            onClick={handleClick}
            dataSound="page_change"
        />
    );
};

export default ToggleSound;
