import { getScreenSize } from "@/utils/screenSize";
import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = (params) => {
    const isRegisterForm = params?.isRegisterForm ?? false;

    return {
        root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            px: {
                xs: 0,
                sm: 0,
                md: 2,
                lg: 4,
            },
            py: 5,
            boxShadow: "none",
        },
        formContainer: {
            display: "flex",
            flexDirection: "row",
            width: 1250,
            maxWidth: "80%",
            minHeight: isRegisterForm ? 400 : 350,
            borderRadius: "lg",
            boxShadow: "none",
            overflow: "hidden",
            position: "relative",
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                flexDirection: "column-reverse",
                height: "auto",
                width: 400,
                maxWidth: "90%",
            },
        },
    };
};

export default useStyles;
