import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = () => {
    return {
        root: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            margin: "0 auto",
            py: { xs: 4, md: 6 },
            px: { xs: 2, sm: 4 },
            gap: 2,
        },
        titleStyles: {
            color: "#eeeeee",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            alignSelf: "flex-start",
            mb: 1,
            borderLeft: "3px solid rgba(56, 182, 255, 0.8)",
            pl: 2,
        },
        imageContainer: {
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid rgba(56, 182, 255, 0.3)",
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "rgba(8, 20, 40, 0.6)",
            boxShadow:
                "0 0 25px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(56, 182, 255, 0.15)",
            "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                    "radial-gradient(circle at center, rgba(56, 182, 255, 0.1) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 1,
            },
        },
        noVisualData: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(56, 182, 255, 0.3)",
        },
        divider: {
            position: "absolute",
            inset: 0,
            background:
                "linear-gradient(rgba(25, 118, 210, 0.08) 50%, rgba(0, 0, 0, 0.15) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none",
            zIndex: 2,
        },
        bodyStyles: {
            color: "rgba(178, 221, 255, 0.7)",
            fontStyle: "italic",
            textAlign: "center",
            mt: 1,
            maxWidth: "100%",
            letterSpacing: "0.05em",
        },
    };
};

export default useStyles;
