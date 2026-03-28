import { MUIStylesService } from "@repo/type-definitions/styles";

const useStyles: MUIStylesService = () => {
    return {
        hologramControl: {
            "& .MuiInputLabel-root": {
                color: "rgba(179, 224, 255, 0.85)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
                color: "rgba(214, 239, 255, 0.95)",
            },
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
            "& .MuiFormHelperText-root": {
                color: "rgba(179, 224, 255, 0.8)",
            },
        },
        hologramSlider: {
            color: "#6CCBFF",
            px: 0.8,
            "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                border: "2px solid rgba(190, 236, 255, 0.95)",
                boxShadow: "0 0 12px rgba(56, 182, 255, 0.6)",
                backgroundColor: "rgba(13, 35, 64, 0.95)",
            },
            "& .MuiSlider-track": {
                border: "none",
                height: 6,
                boxShadow: "0 0 8px rgba(56, 182, 255, 0.4)",
            },
            "& .MuiSlider-rail": {
                height: 6,
                opacity: 1,
                backgroundColor: "rgba(25,118,210, 0.35)",
            },
            "& .MuiSlider-valueLabel": {
                backgroundColor: "rgba(8, 39, 74, 0.96)",
                border: "1px solid rgba(25,118,210, 0.6)",
            },
        },
    };
};

export default useStyles;
