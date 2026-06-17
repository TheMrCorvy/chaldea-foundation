import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = () => {
    return {
        root: {
            position: "relative",
            width: "100%",
            maxWidth: "1500px",
            margin: "5rem auto",
            border: "1px solid rgba(25,118,210, 0.4)",
            background:
                "linear-gradient(135deg, rgba(8, 20, 40, 0.8) 0%, rgba(12, 36, 72, 0.7) 100%)",
            boxShadow:
                "inset 0 0 20px rgba(56, 182, 255, 0.1), 0 0 15px rgba(25,118,210, 0.15)",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
                boxShadow:
                    "inset 0 0 25px rgba(56, 182, 255, 0.2), 0 0 25px rgba(56, 182, 255, 0.25)",
            },
        },
        textContainer: {
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            minHeight: "450px",
        },
        textContent: {
            flex: 1,
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            gap: 3,
            "&::after": {
                content: '""',
                position: "absolute",
                right: 0,
                top: "10%",
                bottom: "10%",
                width: "1px",
                background:
                    "linear-gradient(to bottom, transparent, rgba(56,182,255,0.4), transparent)",
                display: { xs: "none", md: "block" },
            },
        },
        title: {
            mb: 2,
            color: "#eeeeee",
            fontSize: { xs: "1.5rem", md: "2.5rem" },
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        },
        hologramImage: {
            flex: 1,
            position: "relative",
            minHeight: { xs: "300px", md: "auto" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            width: { xs: "100%", md: "100vw" },
            background:
                "radial-gradient(circle at center, rgba(56, 182, 255, 0.1) 0%, transparent 70%)",
        },
        noImage: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(56, 182, 255, 0.3)",
        },
        noData: {
            letterSpacing: "0.2em",
            fontWeight: "bold",
        },
        divider: {
            position: "absolute",
            inset: 0,
            background:
                "linear-gradient(rgba(25, 118, 210, 0.05) 50%, rgba(0, 0, 0, 0.1) 50%)",
            backgroundSize: "100% 4px",
            pointerEvents: "none",
            zIndex: 3,
        },
    };
};

export default useStyles;
