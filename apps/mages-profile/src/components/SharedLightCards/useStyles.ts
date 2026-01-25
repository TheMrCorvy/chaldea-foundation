import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = (params) => {
    const { isHovering } = params || {};

    return {
        root: {
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
            },
            gap: "8px",
            width: "100%",
            maxWidth: "900px",
            mx: "auto",
        },
        card: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            position: "relative",
            height: "260px",
            cursor: "pointer",
            "&::before": {
                content: '""',
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "inherit",
                background:
                    "radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.4), transparent 40%)",
                zIndex: 1,
                opacity: isHovering ? 1 : 0,
                transition: "opacity 0.5s",
            },
        },
        cardContent: {
            backgroundColor: "#171717",
            borderRadius: "inherit",
            position: "absolute",
            inset: "1px",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover::before": {
                opacity: 1,
            },
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                    "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.15), transparent 40%)",
                borderRadius: "inherit",
                zIndex: 3,
                opacity: 0,
                transition: "opacity 0.5s",
            },
        },
        innerContent: {
            position: "relative",
            zIndex: 4,
            color: "rgba(255, 255, 255, 0.5)",
            "& svg": {
                width: "32px",
                height: "32px",
            },
        },
    };
};

export default useStyles;
