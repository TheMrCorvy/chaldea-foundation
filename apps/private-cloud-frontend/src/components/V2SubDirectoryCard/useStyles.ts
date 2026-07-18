import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = () => {
    return {
        root: { mt: 7 },
        cardLink: {
            textDecoration: "none",
            position: "relative",
            zIndex: 0,
            display: "block",
            height: "100%",
        },
        cardStyles: {
            height: 180,
            overflow: "visible",
            position: "relative",
            backgroundColor: "#0B6BCB15 !important",
            border: "1px solid #0B6BCB40",
            transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
            padding: "12px 12px 12px 0",
            "&:hover": {
                cursor: "pointer",
                transform: "scale(1.02)",
                backgroundColor: "#0B6BCB25 !important",
                borderColor: "#0B6BCB80",
                "& .card-cover-image": {
                    transform: "scale(1.05)",
                },
            },
        },
        cardCover: {
            width: 150,
            height: 250,
            position: "relative",
            marginTop: "-70px",
            marginLeft: "12px",
            flexShrink: 0,
            overflow: "hidden",
            borderRadius: "8px",
        },
        coverStyles: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.2s ease-in-out",
        },
        cardBodyStyles: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 0.5,
            paddingLeft: 2,
            paddingRight: 1,
            minWidth: 0,
        },
        titleStyles: {
            color: "white",
            fontWeight: 600,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        cardBtnStyles: {
            px: 1.2,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "xs",
            fontWeight: "xl",
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderLeft: "1px solid",
            borderColor: "#0B6BCB40",
            backgroundColor: "#0B6BCB15",
            color: "#0B6BCB",
            transition: "all 0.2s ease-in-out",
            borderTopLeftRadius: "8px !important",
            borderBottomLeftRadius: "8px !important",
        },
        tagsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            marginTop: "auto",
            // maxHeight: 28,
        },
        tagStyles: {
            textTransform: "capitalize",
            backgroundColor: "#0B6BCB20",
            color: "#0B6BCB",
        },
        descriptionStyles: {
            color: "#A8B2C3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.4",
        },
    };
};

export default useStyles;
