import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = () => {
    return {
        root: {
            bgcolor: "transparent",
            p: { md: 3, sm: 0 },
            boxShadow: "none",
        },
        mainContainer: {
            borderRadius: "md",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
            overflow: "auto",
        },
        formControl: {
            paddingLeft: 2,
        },
        formLabel: {
            typography: "title-md",
            fontWeight: "bold",
        },
        buttonContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 1.5,
        },
        card: {
            boxShadow: "none",
            "&:hover": {
                bgcolor: "background.level1",
            },
        },
    };
};

export default useStyles;
