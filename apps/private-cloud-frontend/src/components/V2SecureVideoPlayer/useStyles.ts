import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = () => {
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
    };
};

export default useStyles;
