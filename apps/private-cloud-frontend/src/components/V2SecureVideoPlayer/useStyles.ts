import { getScreenSize } from "@/utils/screenSize";
import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = (params) => {
    const showControls = params?.showControls;
    return {
        root: {
            background: "neutral.900",
            borderRadius: 20,
            "--Card-padding": {
                xs: "8px",
                md: "16px",
            },
            "--Card-radius": "20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
        cardContent: {
            gap: 1,
            pb: 1,
            zIndex: 0,
        },
        mainBox: {
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#000",
            border: "1px solid",
            borderColor: "neutral.200",
            transition: "transform 0.2s ease",
            "&:hover": {
                cursor: "pointer",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
        },
        videoTag: {
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            maxWidth: "100%",
            display: "block",
            aspectRatio: "16/9",
        },
        playPauseContainer: {
            position: "absolute",
            top: {
                xs: "40%",
                md: "50%",
            },
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            animation: "fadeInScale 0.2s ease-in",
            "@keyframes fadeInScale": {
                "0%": {
                    opacity: 0,
                    transform: "translate(-50%, -50%) scale(0.8)",
                },
                "100%": {
                    opacity: 1,
                    transform: "translate(-50%, -50%) scale(1)",
                },
            },
        },
        playIconBtn: {
            width: {
                xs: 20,
                md: 80,
            },
            height: {
                xs: 20,
                md: 80,
            },
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
        },
        loaderContainer: {
            position: "absolute",
            top: {
                xs: "40%",
                md: "50%",
            },
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
        },
        controlsContainer: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
            padding: "20px 16px 12px 16px",
            zIndex: 10,
        },
        progressBar: {
            "--Slider-trackSize": "4px",
            "--Slider-thumbSize": "14px",
            "--Slider-thumb-shadow": "0 0 0 8px",
        },
        bottomControlsContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
        },
        leftPlayPauseContainer: {
            display: "flex",
            alignItems: "center",
            gap: 1,
        },
        iconBtn: { width: 36, height: 36 },
        volumeSliderContainer: {
            display: "flex",
            alignItems: "center",
            animation: "slideInVolume 0.2s ease-in-out",
            "@keyframes slideInVolume": {
                "0%": {
                    opacity: 0,
                    width: "0px",
                },
                "100%": {
                    opacity: 1,
                    width: "80px",
                },
            },
            width: "80px",
            overflow: "hidden",
        },
        volumeSlider: {
            "--Slider-trackSize": "3px",
            "--Slider-thumbSize": "12px",
            "--Slider-thumb-shadow": "0 0 0 6px",
        },
        currentTimeStyles: {
            color: "white",
            fontSize: "12px",
            fontWeight: 500,
        },
        languageControlsContainer: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            py: 2,
            gap: 2,
            zIndex: 0,
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                flexDirection: "column",
                gap: 3,
            },
        },
        languageControlsStack: {
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                width: "100%",
                justifyContent: "center",
            },
        },
        langTitle: {
            textAlign: "left",
            mb: 0.5,
            color: "white",
            paddingLeft: 0.5,
        },
        subtitleContainer: {
            position: "absolute",
            bottom: showControls
                ? 120
                : {
                      xs: 20,
                      md: 40,
                      lg: 80,
                  },
            width: {
                xs: "90%",
                md: "60%",
                lg: "100%",
            },
            bgcolor: "rgba(0, 0, 0, 0.6)",
            borderRadius: 2,
            padding: 1,
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
        },
        subtitleSpan: {
            color: "white",
            fontSize: "32px",
            textAlign: "center",
        },
        timelineTooltip: {
            position: "absolute",
            bottom: "100%",
            transform: "translateX(-50%)",
            mb: 1.5,
            bgcolor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
            px: 1.2,
            py: 0.6,
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 20,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            "&::after": {
                content: '""',
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "5px",
                borderStyle: "solid",
                borderColor:
                    "rgba(0, 0, 0, 0.8) transparent transparent transparent",
            },
        },
        timelineTooltipText: {
            color: "white",
            fontSize: "12px",
            fontWeight: 600,
        },
    };
};

export default useStyles;
