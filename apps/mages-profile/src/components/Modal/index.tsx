import { Box, Grid } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { FC, MouseEvent, ReactNode } from "react";
import GlitchBackgroundCard from "../GlitchBacgkroundCard";
import PixelCard from "../PixelCard";
import AddIcon from "@mui/icons-material/Add";

export interface ModalProps {
    children: ReactNode;
    open: boolean;
    onExit: (props?: unknown) => void;
    isMobile: boolean;
}

interface RenderContentParams {
    colNumber: number;
    rowNumber: number;
}

type RenderContent = (params: RenderContentParams) => ReactNode;

const Modal: FC<ModalProps> = ({ children, open, onExit, isMobile }) => {
    const rows = Array.from({ length: 3 }, (_, i) => i);
    const columns = Array.from({ length: 3 }, (_, i) => i);

    const stopModalContentClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    const calcRowHeight = (colNumber: number) => {
        if (colNumber === 0) {
            return "5dvh";
        }

        if (colNumber === 1) {
            return isMobile ? "60dvh" : "50dvh";
        }

        return isMobile ? "35dvh" : "45dvh";
    };

    const calcColSize = (colNumber: number) => {
        if (colNumber === 0) {
            return {
                xs: 1,
                sm: 4,
                md: 6,
            };
        }

        if (colNumber === 1) {
            return {
                xs: 10,
                sm: 7,
                md: 5,
            };
        }

        return 1;
    };

    const renderContent: RenderContent = ({ colNumber, rowNumber }) => {
        if (colNumber === 1 && rowNumber === 1) {
            if (isMobile) {
                const cornerIconSize = 24;

                return (
                    <Box
                        onClick={stopModalContentClick}
                        data-sound="modal"
                        sx={{ width: "100%", height: "100%" }}
                    >
                        <PixelCard
                            roundedBorders={false}
                            height="100%"
                            width="100%"
                            focusOnMount
                            variant="blue"
                            borders={{
                                left: true,
                                right: true,
                            }}
                            data-sound="modal"
                        >
                            <AddIcon
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    top: -cornerIconSize / 2,
                                    left: -cornerIconSize / 2,
                                    fontSize: cornerIconSize,
                                }}
                                data-sound="modal"
                            />
                            <AddIcon
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    top: -cornerIconSize / 2,
                                    right: -cornerIconSize / 2,
                                    fontSize: cornerIconSize,
                                    transform: "rotate(90deg)",
                                }}
                                data-sound="modal"
                            />
                            <AddIcon
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    bottom: -cornerIconSize / 2,
                                    right: -cornerIconSize / 2,
                                    fontSize: cornerIconSize,
                                    transform: "rotate(180deg)",
                                }}
                                data-sound="modal"
                            />
                            <AddIcon
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    bottom: -cornerIconSize / 2,
                                    left: -cornerIconSize / 2,
                                    fontSize: cornerIconSize,
                                    transform: "rotate(270deg)",
                                }}
                                data-sound="modal"
                            />
                            <Box
                                sx={{
                                    paddingLeft: 0,
                                    paddingRight: "11px",
                                    height: "100%",
                                    width: "100%",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    color: "white",
                                    background: "rgba(0, 0, 0, 0.15)",
                                    py: 2,
                                }}
                                data-sound="modal"
                            >
                                {children}
                            </Box>
                        </PixelCard>
                    </Box>
                );
            }
            return (
                <Box
                    onClick={stopModalContentClick}
                    data-sound="modal"
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <GlitchBackgroundCard
                        data-sound="modal"
                        isMobile={isMobile}
                    >
                        {children}
                    </GlitchBackgroundCard>
                </Box>
            );
        }

        if (colNumber === 1) {
            return (
                <Box
                    data-sound="modal"
                    sx={{
                        width: 450,
                        height: "100%",
                        borderLeft: "1px solid rgba(25,118,210, 0.6)",
                        borderRight: "1px solid rgba(25,118,210, 0.6)",
                    }}
                />
            );
        }

        return null;
    };

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100dvh",
                            width: "100dvw",
                            backgroundColor: isMobile
                                ? "rgba(0, 0, 0, 0.4)"
                                : "rgba(8, 46, 105, 0.45)",
                            backgroundImage: isMobile
                                ? "none"
                                : 'linear-gradient(rgba(8, 46, 105, 0.5), rgba(8, 46, 105, 0.5)), url("https://www.transparenttextures.com/patterns/checkered-pattern.png")',
                            backgroundRepeat: isMobile ? undefined : "repeat",
                            backgroundSize: isMobile ? undefined : "auto",
                            backgroundBlendMode: isMobile
                                ? undefined
                                : "multiply",
                            zIndex: 9999,
                        }}
                        onClick={onExit}
                        data-sound="modal"
                    >
                        <Grid container spacing={0} data-sound="modal">
                            {rows.map((row) => {
                                const commonSx = {
                                    display: "flex",
                                    height: calcRowHeight(row),
                                    borderBottom:
                                        row === 1
                                            ? "1px solid rgba(25,118,210, 0.6)"
                                            : undefined,
                                    borderTop:
                                        row === 1
                                            ? "1px solid rgba(25,118,210, 0.6)"
                                            : undefined,
                                };

                                return (
                                    <Grid
                                        size={12}
                                        key={`modal-row-${row}`}
                                        spacing={0}
                                        sx={commonSx}
                                        data-sound="modal"
                                    >
                                        {columns.map((col) => (
                                            <Grid
                                                key={`modal-col-${col}`}
                                                spacing={0}
                                                data-sound="modal"
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "end",
                                                    alignItems: "end",
                                                    padding: 0,
                                                }}
                                                size={calcColSize(col)}
                                            >
                                                {renderContent({
                                                    colNumber: col,
                                                    rowNumber: row,
                                                })}
                                            </Grid>
                                        ))}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
