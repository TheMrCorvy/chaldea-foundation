import { StylesService } from "@repo/type-definitions/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getScreenSize } from "@/utils/screenSize";

const useStyles: StylesService = () => {
    const matches = useMediaQuery(`(max-width:${getScreenSize("md")}px)`);

    return {
        root: {
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: matches ? 0 : "2vh",
        },
        sheet: {
            p: 1,
            zIndex: 1100,
            boxShadow: "lg",
            borderRadius: {
                xs: 0,
                md: "xl",
            },
            width: matches ? "100%" : "50%",
        },
    };
};

export default useStyles;
