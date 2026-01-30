import { Box, Grid } from "@mui/material";
import { FC, ReactNode } from "react";
import GlitchBackgroundCard from "./GlitchBacgkroundCard";

export interface ModalProps {
    children: ReactNode;
    open: boolean;
    onExit: (props?: unknown) => void;
}

interface RenderContentParams {
    colNumber: number;
    rowNumber: number;
}

type RenderContent = (params: RenderContentParams) => ReactNode;

const Modal: FC<ModalProps> = ({ children, open, onExit }) => {
    if (!open) {
        return null;
    }

    const rows = Array.from({ length: 3 }, (_, i) => i);
    const columns = Array.from({ length: 3 }, (_, i) => i);

    const calcRowHeight = (colNumber: number) => {
        if (colNumber === 0) {
            return "5dvh";
        }

        if (colNumber === 1) {
            return "50dvh";
        }

        return "45dvh";
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
            return <GlitchBackgroundCard>{children}</GlitchBackgroundCard>;
        }

        if (colNumber === 1) {
            return (
                <Box
                    sx={{
                        width: 450,
                        height: "100%",
                        borderLeft: "1px solid rgba(255, 255, 255, 0.10)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.10)",
                    }}
                ></Box>
            );
        }

        return null;
    };

    return (
        <Box
            onClick={onExit}
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100dvh",
                width: "100dvw",
                backgroundColor: "rgba(0,0,0,0.5)",

                zIndex: 9999,
            }}
        >
            <Grid container spacing={0}>
                {rows.map((row) => (
                    <Grid
                        size={12}
                        key={`modal-row-${row}`}
                        spacing={0}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            height: calcRowHeight(row),
                            borderBottom:
                                row === 1
                                    ? "1px solid rgba(255, 255, 255, 0.10)"
                                    : "",
                            borderTop:
                                row === 1
                                    ? "1px solid rgba(255, 255, 255, 0.10)"
                                    : "",
                        }}
                    >
                        {columns.map((col) => (
                            <Grid
                                key={`modal-col-${col}`}
                                spacing={0}
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
                ))}
            </Grid>
        </Box>
    );
};

export default Modal;
