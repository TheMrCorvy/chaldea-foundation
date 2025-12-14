import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = (params) => {
    return {
        root: {
            width: "20%",
            display: "flex",
            justifyContent: "center",
            verticalAlign: "center",
        },
        button: {
            width: "100%",
            p: 1,
            borderRadius: "lg",
            minWidth: 0,
            color: "white",
            backgroundColor: params?.isSelected ? "primary.600" : "transparent",
            transition: "background-color 0.2s ease-in-out",
            "&:hover": {
                backgroundColor: "primary.600",
            },
            "& .MuiButton-startDecorator": {
                "--Button-iconSize": "28px",
                fontSize: "28px",
                m: 0,
                mb: 0.5,
            },
        },
        actionLabel: {
            textTransform: "uppercase",
            fontWeight: "lg",
            fontSize: "0.65rem",
            color: "inherit",
        },
        iconStyles: { color: "inherit" },
    };
};

export default useStyles;
