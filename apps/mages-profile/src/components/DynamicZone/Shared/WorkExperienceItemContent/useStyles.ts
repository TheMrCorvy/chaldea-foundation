import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = () => {
    return {
        root: {
            px: 3,
            pt: 5,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
        },
        titleContainer: {
            fontWeight: 500,
            lineHeight: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
        },
        titleBox: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "100%",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
        },
        orientationBox: {
            display: "flex",
            justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
            },
            alignItems: "flex-start",
            width: { xs: "100%", sm: "50%" },
        },
        orientationStyles: {
            color: "secondary.light",
            fontSize: "0.55em",
            fontWeight: 600,
            border: "1px solid",
            borderColor: "secondary.main",
            borderRadius: "4px",
            padding: "2px 8px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        },
        companyClient: {
            display: "flex",
            flexDirection: {
                xs: "column",
                sm: "row",
            },
            alignItems: { xs: "flex-start", sm: "center" },
        },
        companyStyles: {
            color: "#e0e0e0",
            fontWeight: 600,
            display: "flex",
            gap: 1,
            mt: 1,
            fontSize: "1.15rem",
            justifyContent: "flex-start",
            textAlign: { xs: "left", sm: "center" },
            alignItems: "center",
        },
        clientStyles: {
            color: "#b0b0b0",
            fontWeight: 500,
            fontSize: "0.95rem",
            mt: { xs: 0, sm: 1 },
            ml: {
                xs: 0,
                sm: 1,
            },
        },
        datesContainer: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 3,
            mt: 1,
            mb: 3,
            flexWrap: "wrap",
        },
        dateStyles: {
            color: "#b0b0b0",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: "0.95rem",
        },
        locationStyles: {
            color: "#b0b0b0",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: "0.95rem",
        },
        richTextContainer: {
            mt: 1,
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    };
};

export default useStyles;
