import { getScreenSize } from "@/utils/screenSize";
import { StylesService } from "@repo/type-definitions/styles";

const useStyles: StylesService = () => {
    return {
        root: {
            flex: 1,
            bgcolor: "primary.solidBg",
            color: "white",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "center",
            gap: 2,
            position: "relative",
            boxShadow: "none",
            borderLeft: "2px dashed white",
            borderRight: "2px dashed white",
            [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                borderLeft: "none",
                borderRight: "none",
                borderBottom: "2px dashed white",
                borderTop: "2px dashed white",
            },
        },
        verticalText: {
            position: "absolute",
            top: "50%",
            left: "12%",
            transform: "translate(-50%, -50%) rotate(-90deg)",
            whiteSpace: "nowrap",
            color: "primary.softColor",
            letterSpacing: "5px",
            opacity: 0.3,
            boxShadow: "none",
        },
        qrContainer: { mt: 5, zIndex: 1 },
        invitationText: { letterSpacing: "2px", color: "white" },
        invitationCode: {
            color: "#555E68",
            textTransform: "uppercase",
            letterSpacing: "2px",
        },
        qrStyles: {
            p: 1,
            bgcolor: "white",
            display: "inline-block",
            borderRadius: "sm",
            boxShadow: "sm",
            mb: 0.5,
        },
    };
};

export default useStyles;
