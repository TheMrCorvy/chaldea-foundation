import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = () => {
    return {
        root: {
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            px: 2,
            py: 4,
        },
        floatErrorBlob: {
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            filter: "blur(36px)",
            top: { xs: "-60px", sm: "-90px" },
            right: { xs: "-80px", sm: "-30px" },
            animation: "floatErrorBlob 8s ease-in-out infinite",
            "@keyframes floatErrorBlob": {
                "0%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(18px)" },
                "100%": { transform: "translateY(0px)" },
            },
        },
        positionRelative: { position: "relative" },
        paper: {
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backdropFilter: "blur(8px)",
            bgcolor: "rgba(255, 255, 255, 0.82)",
        },
        chip: {
            fontWeight: 700,
            color: "#ffffff",
        },
        statusCodeStyles: {
            fontSize: { xs: "3rem", sm: "3.75rem" },
            lineHeight: 1,
            fontWeight: 800,
        },
        mainTitle: {
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: "#121212",
        },
        descriptionStyles: { color: "#424242" },
        detailsStyles: {
            color: "#616161",
            px: 1.5,
            py: 1,
            borderRadius: 2,
            bgcolor: "rgba(0, 0, 0, 0.05)",
            width: "100%",
        },
        buttonStyles: {
            px: 3,
            fontWeight: 700,
            flex: { xs: "1 1 auto", sm: "0 0 auto" },
            color: "#ffffff",
        },
    };
};

export default useStyles;
