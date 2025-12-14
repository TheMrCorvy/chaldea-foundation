import { themeConfig } from "@/lib/theme";
import { getScreenSize } from "@/utils/screenSize";
import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = () => {
    return {
        root: {
            p: 4,
            bgcolor: "background.level2",
            position: "relative",
            boxShadow: "none",
            borderLeft: "2px dashed white",
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                borderLeft: "none",
                borderBottom: "2px dashed white",
            },
        },
        form: {
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            justifyContent: "center",
        },
        fullWidth: {
            width: "100%",
        },
        button: { mt: "auto", width: "100%" },
        inputTextColor: {
            color:
                themeConfig.colorSchemes?.dark?.palette?.text?.secondary ||
                "white",
            "& input::placeholder": {
                color:
                    themeConfig.colorSchemes?.dark?.palette?.neutral?.[300] ||
                    "white",
                opacity: 0.5,
            },
        },
    };
};

export default useStyles;
