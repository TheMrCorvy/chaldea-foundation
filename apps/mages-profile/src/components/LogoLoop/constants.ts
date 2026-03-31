export const ANIMATION_CONFIG = {
    SMOOTH_TAU: 0.25,
    MIN_COPIES: 2,
    COPY_HEADROOM: 2,
} as const;

export const HOLOGRAM_COLORS = {
    edgeGlowStrong: "rgba(8, 46, 105, 0.45)",
    edgeGlowInner: "rgba(42, 131, 156, 0.3)",
    edgeGradientStrong: "rgba(129, 241, 255, 0.28)",
    edgeGradientSoft: "rgba(129, 241, 255, 0.12)",
    glitchStripe: "rgba(79, 235, 255, 0.18)",
    noiseCyan: "rgba(70, 233, 255, 0.14)",
    noiseWhite: "rgba(255, 255, 255, 0.03)",
    transparent: "rgba(0, 0, 0, 0)",
} as const;

export const GLITCH_KEYFRAMES = `
@keyframes logo-loop-holo-shift {
    0%, 100% {
        opacity: 0.32;
        transform: translate3d(0, 0, 0);
    }
    17% {
        opacity: 0.45;
        transform: translate3d(-1px, 0, 0);
    }
    18% {
        opacity: 0.25;
        transform: translate3d(1px, 0, 0);
    }
    39% {
        opacity: 0.4;
        transform: translate3d(0, 0, 0);
    }
    40% {
        opacity: 0.52;
        transform: translate3d(0, -1px, 0);
    }
    41% {
        opacity: 0.28;
        transform: translate3d(0, 1px, 0);
    }
    75% {
        opacity: 0.38;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes logo-loop-holo-flicker {
    0%, 100% {
        opacity: 0.18;
    }
    5% {
        opacity: 0.24;
    }
    6% {
        opacity: 0.14;
    }
    31% {
        opacity: 0.2;
    }
    32% {
        opacity: 0.3;
    }
    33% {
        opacity: 0.16;
    }
    64% {
        opacity: 0.26;
    }
    65% {
        opacity: 0.17;
    }
}

@media (prefers-reduced-motion: reduce) {
    .logo-loop-glitch,
    .logo-loop-noise {
        animation: none !important;
    }
}
`;
