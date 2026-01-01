import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = () => {
    return {
        listItemButton: {
            borderRadius: "sm",
            "&:hover": {
                backgroundColor: "#0B6BCB !important",
                color: "white !important",
            },
        },
        colorWhite: {
            color: "white",
        },
        loader: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
        },
        errorLoading: {
            paddingLeft: 2,
            marginTop: 3,
        },
        emptyPage: {
            paddingLeft: 2,
            marginTop: 3,
        },
    };
};

export default useStyles;
