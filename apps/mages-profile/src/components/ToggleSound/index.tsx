"use client";

import { useSound } from "@/contexts/SoundContext";
import GlitchButton from "../GlitchButton";
import { FC, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import styles from "./ToggleSound.module.css";

export interface ToggleSoundProps {
    useLeftSideBtn?: boolean;
}

const ToggleSound: FC<ToggleSoundProps> = ({ useLeftSideBtn }) => {
    const {
        soundEnabled,
        setSoundEnabled,
        playSound,
        bgmVolume,
        setBgmVolume,
        sfxVolume,
        setSfxVolume,
    } = useSound();

    const [showPanel, setShowPanel] = useState(false);

    const isHoveredRef = useRef(false);
    const isDraggingRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        isHoveredRef.current = true;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setShowPanel(true);
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        if (isDraggingRef.current) return; // Keep open while dragging/sliding

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (!isHoveredRef.current && !isDraggingRef.current) {
                setShowPanel(false);
            }
        }, 1000); // 1 second grace period
    };

    const handlePanelMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isDraggingRef.current = true;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            isDraggingRef.current = false;
            // If dragging ended and mouse is no longer hovering container, start the close timer
            if (!isHoveredRef.current) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    if (!isHoveredRef.current && !isDraggingRef.current) {
                        setShowPanel(false);
                    }
                }, 1000);
            }
        };

        const handleOutsideClick = (e: MouseEvent) => {
            const container = document.getElementById("toggle-sound-container");
            if (container && !container.contains(e.target as Node)) {
                setShowPanel(false);
                isHoveredRef.current = false;
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            }
        };

        window.addEventListener("mouseup", handleGlobalMouseUp);
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mouseup", handleGlobalMouseUp);
            document.removeEventListener("mousedown", handleOutsideClick);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleClick = () => {
        playSound("page_change");
        setSoundEnabled(!soundEnabled);
    };

    return (
        <div
            id="toggle-sound-container"
            className={styles.container}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <GlitchButton
                label="Sound Effects"
                cornerVariant={useLeftSideBtn ? "left" : "right"}
                active={soundEnabled}
                onClick={handleClick}
                dataSound="page_change"
            />
            <AnimatePresence>
                {soundEnabled && showPanel && (
                    <motion.div
                        className={`${styles.sliderPanel} ${
                            useLeftSideBtn ? styles.leftSide : styles.rightSide
                        }`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onMouseDown={handlePanelMouseDown}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.panelTitle}>Sound Config</div>

                        {/* BGM Volume Slider */}
                        <div className={styles.volumeRow}>
                            <div className={styles.labelRow}>
                                <span className={styles.label}>BGM Volume</span>
                                <span className={styles.value}>
                                    {Math.round(bgmVolume * 100)}%
                                </span>
                            </div>
                            <div className={styles.sliderWrapper}>
                                <div className={styles.iconWrapper}>
                                    {bgmVolume === 0 ? (
                                        <VolumeOff fontSize="small" />
                                    ) : (
                                        <VolumeDown fontSize="small" />
                                    )}
                                </div>
                                <Slider
                                    value={bgmVolume}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onChange={(_, val) =>
                                        setBgmVolume(val as number)
                                    }
                                    size="small"
                                    sx={{
                                        color: "#29b6f6",
                                        height: 4,
                                        padding: "13px 0",
                                        "& .MuiSlider-thumb": {
                                            height: 12,
                                            width: 12,
                                            backgroundColor: "#29b6f6",
                                            border: "1px solid #fff",
                                            borderRadius: "0px",
                                            "&:hover, &.Mui-focusVisible, &.Mui-active":
                                                {
                                                    boxShadow:
                                                        "0 0 10px #29b6f6",
                                                },
                                        },
                                        "& .MuiSlider-track": {
                                            border: "none",
                                            backgroundColor: "#29b6f6",
                                        },
                                        "& .MuiSlider-rail": {
                                            opacity: 0.3,
                                            backgroundColor: "#29b6f6",
                                        },
                                    }}
                                />
                                {bgmVolume > 0 ? (
                                    <div className={styles.iconWrapper}>
                                        <VolumeUp fontSize="small" />
                                    </div>
                                ) : (
                                    <div className={styles.iconSpacer} />
                                )}
                            </div>
                        </div>

                        {/* SFX Volume Slider */}
                        <div className={styles.volumeRow}>
                            <div className={styles.labelRow}>
                                <span className={styles.label}>SFX Volume</span>
                                <span className={styles.value}>
                                    {Math.round(sfxVolume * 100)}%
                                </span>
                            </div>
                            <div className={styles.sliderWrapper}>
                                <div className={styles.iconWrapper}>
                                    {sfxVolume === 0 ? (
                                        <VolumeOff fontSize="small" />
                                    ) : (
                                        <VolumeDown fontSize="small" />
                                    )}
                                </div>
                                <Slider
                                    value={sfxVolume}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    onChange={(_, val) =>
                                        setSfxVolume(val as number)
                                    }
                                    size="small"
                                    sx={{
                                        color: "#29b6f6",
                                        height: 4,
                                        padding: "13px 0",
                                        "& .MuiSlider-thumb": {
                                            height: 12,
                                            width: 12,
                                            backgroundColor: "#29b6f6",
                                            border: "1px solid #fff",
                                            borderRadius: "0px",
                                            "&:hover, &.Mui-focusVisible, &.Mui-active":
                                                {
                                                    boxShadow:
                                                        "0 0 10px #29b6f6",
                                                },
                                        },
                                        "& .MuiSlider-track": {
                                            border: "none",
                                            backgroundColor: "#29b6f6",
                                        },
                                        "& .MuiSlider-rail": {
                                            opacity: 0.3,
                                            backgroundColor: "#29b6f6",
                                        },
                                    }}
                                />
                                {sfxVolume > 0 ? (
                                    <div className={styles.iconWrapper}>
                                        <VolumeUp fontSize="small" />
                                    </div>
                                ) : (
                                    <div className={styles.iconSpacer} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ToggleSound;
