import { getScreenSize } from "@/utils/screenSize";
import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = (params) => {
    return {
        root: {
            flex: 2,
            p: {
                xs: 2,
                sm: 2,
                md: 3,
                lg: 3,
            },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "background.level2",
            position: "relative",
            boxShadow: "none",
            borderRight: "2px dashed white",
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                borderRight: "none",
                borderTop: "2px dashed white",
                minHeight: "300px",
            },
        },
        title: {
            fontSize: {
                xs: "var(--joy-fontSize-xl)",
                sm: "var(--joy-fontSize-xl)",
                md: "var(--joy-fontSize-xl)",
                lg: "var(--joy-fontSize-xl4)",
            },
            color: "white",
        },
        ticketNumber: {
            paddingLeft: "3%",
        },
        date: {
            fontSize: {
                sm: "var(--joy-fontSize-xs)",
                xs: "var(--joy-fontSize-xs)",
                md: "var(--joy-fontSize-xs)",
                lg: "var(--joy-fontSize-md)",
            },
        },
        userContainer: {
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
        },
        userName: {
            color: "white",
            textTransform: "capitalize",
        },
        image: {
            position: "absolute",
            bottom: params?.isRegisterForm ? "-90%" : "-110%",
            right: "-15%",
            width: "20rem",
            height: "auto",
            borderRadius: 2,
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                position: "absolute",
                bottom: "-155%",
                right: "-30%",
            },
        },
    };
};

export default useStyles;
