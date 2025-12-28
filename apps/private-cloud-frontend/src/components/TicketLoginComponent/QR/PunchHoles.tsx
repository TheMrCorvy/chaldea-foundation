import { Box } from "@mui/joy";

const PunchHoles = () => {
    return (
        <>
            <Box
                sx={{
                    zIndex: 1,
                    position: "absolute",
                    left: -30,
                    top: -30,
                    width: 50,
                    borderRadius: "50%",
                    height: 50,
                    bgcolor: "background.body",
                    boxShadow: "none",
                }}
            />
            <Box
                sx={{
                    zIndex: 1,
                    position: "absolute",
                    right: -30,
                    top: -30,
                    width: 50,
                    borderRadius: "50%",
                    height: 50,
                    bgcolor: "background.body",
                    boxShadow: "none",
                }}
            />
            <Box
                sx={{
                    zIndex: 1,
                    position: "absolute",
                    right: -30,
                    bottom: -30,
                    width: 50,
                    borderRadius: "50%",
                    height: 50,
                    bgcolor: "background.body",
                    boxShadow: "none",
                }}
            />
            <Box
                sx={{
                    zIndex: 1,
                    position: "absolute",
                    left: -30,
                    bottom: -30,
                    width: 50,
                    borderRadius: "50%",
                    height: 50,
                    bgcolor: "background.body",
                    boxShadow: "none",
                }}
            />
        </>
    );
};

export default PunchHoles;
