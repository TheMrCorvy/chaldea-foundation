import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = () => {
    return {
        root: {
            display: "flex",
            flexDirection: "column",
            width: { xs: "90vw", lg: "100%" },
            maxWidth: "1300px",
            minWidth: 0,
            boxSizing: "border-box",
            mb: 4,
            minHeight: "35rem",
        },
        mainChipsContainer: {
            display: "flex",
            flexDirection: { xs: "column-reverse", lg: "row" },
            minWidth: 0,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", lg: "center" },
            boxSizing: "border-box",
            pt: 6,
        },
        chipsContentStyles: {
            display: "flex",
            flexDirection: "row",
            gap: 2,
            overflowX: "scroll",
            py: 2,
            px: 1.5,
            width: { xs: "100%", lg: "auto" },
            maxWidth: { xs: "95vw", lg: "70%" },
            "&::-webkit-scrollbar": {
                height: "6px",
            },
            "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "rgba(56, 182, 255, 0.3)",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "rgba(56, 182, 255, 0.5)",
            },
        },
        selectedChipStyles: {
            color: "#eeeeee",
            backgroundColor: "rgba(12, 36, 72, 0.4)",
            border: "1px solid rgba(56, 182, 255, 0.3)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 0 10px rgba(56, 182, 255, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.5)",
                borderColor: "rgba(86, 202, 255, 0.8)",
                boxShadow:
                    "0 0 16px rgba(56, 182, 255, 0.4), inset 0 0 8px rgba(56, 182, 255, 0.2)",
                transform: "translateY(-2px)",
            },
            "& .MuiChip-label": {
                px: 2,
                py: 0.5,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                textShadow: "0 0 8px rgba(178, 221, 255, 0.4)",
            },
        },
        unselectedChipStyles: {
            color: "#eeeeee",
            backgroundColor: "transparent",
            border: "none",
            backdropFilter: "blur(4px)",
            boxShadow: "none",
            transition: "all 0.3s ease",
            "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.5)",
                borderColor: "rgba(86, 202, 255, 0.8)",
                boxShadow:
                    "0 0 16px rgba(56, 182, 255, 0.4), inset 0 0 8px rgba(56, 182, 255, 0.2)",
                transform: "translateY(-2px)",
            },
            "& .MuiChip-label": {
                px: 2,
                py: 0.5,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                textShadow: "0 0 8px rgba(178, 221, 255, 0.4)",
            },
        },
        searchFormContainer: {
            width: { xs: "100%", lg: "fit-content" },
            minWidth: { lg: "300px" },
            boxSizing: "border-box",
        },
        searchInputStyles: {
            "& .MuiInputBase-root": {
                color: "#E3F2FD",
                borderRadius: "8px",
                backgroundColor: "rgba(9, 24, 46, 0.45)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(25,118,210, 0.6)",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(56, 182, 255, 0.8)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                    borderColor: "rgba(127, 214, 255, 0.95)",
                },
            "& .MuiOutlinedInput-input": {
                py: 1.1,
            },
        },
        resultsContainer: {
            display: "flex",
            flexDirection: "row",
            gap: 3,
            overflowX: "scroll",
            overflowY: "hidden",
            width: "100%",
            py: 3,
            "&::-webkit-scrollbar": {
                height: "6px",
            },
            "&::-webkit-scrollbar-track": {
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
                background: "rgba(56, 182, 255, 0.3)",
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "rgba(56, 182, 255, 0.5)",
            },
        },
        resultCard: {
            minWidth: 280,
            maxWidth: 280,
            backgroundColor: "rgba(12, 36, 72, 0.4)",
            border: "1px solid rgba(56, 182, 255, 0.3)",
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            color: "#eeeeee",
            display: "flex",
            flexDirection: "column",
        },
        placeholderImage: {
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            color: "rgba(178, 221, 255, 0.5)",
        },
    };
};

export default useStyles;
