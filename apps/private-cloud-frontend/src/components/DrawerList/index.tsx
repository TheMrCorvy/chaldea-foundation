import Box from "@mui/joy/Box";
import Drawer from "@mui/joy/Drawer";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Stack from "@mui/joy/Stack";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { FC, useCallback, useEffect, useState } from "react";
import { Directory } from "@repo/type-definitions";
import { themeConfig } from "@/lib/theme";
import { Radio } from "@mui/joy";
import DrawerListContent from "../DrawerListContent";
import { logData } from "@repo/shared-utils/log-data";
import { GroupedDirectories } from "@/utils/directories";

export interface DrawerListProps {
    open: boolean;
    closeDrawer: () => void;
    mainDirectories: Directory[];
}

export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

const DrawerList: FC<DrawerListProps> = ({
    open,
    closeDrawer,
    mainDirectories,
}) => {
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>("idle");
    const [directories, setDirectories] = useState<
        GroupedDirectories | undefined
    >(undefined);
    const textPrimary =
        themeConfig.colorSchemes?.dark?.palette?.text?.primary || "white";
    const darkText =
        themeConfig.colorSchemes?.dark?.palette?.neutral?.[50] || "gray";
    const neutralBg =
        themeConfig.colorSchemes?.dark?.palette?.neutral?.[500] || "gray";

    const handleClick = (mainDirId: string) => {
        setLoadingState("loading");
        setSelectedDocId(mainDirId);
    };

    const fetchDirectories = useCallback(async () => {
        try {
            setLoadingState("loading");
            const response = await fetch(
                `/api/get-directories/${selectedDocId}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setDirectories(data);
            setLoadingState("succeeded");

            logData({
                layer: "internal_http_requests",
                title: "Fetched directories successfully",
                type: "info",
                data: data,
                timeStamp: true,
                addSeparatorAfter: true,
            });
        } catch (error) {
            logData({
                layer: "*",
                title: "Error fetching directories",
                type: "error",
                data: error,
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
                addSeparatorBefore: true,
                addSpaceBefore: true,
            });
            setLoadingState("failed");
        }
    }, [selectedDocId]);

    useEffect(() => {
        if (!selectedDocId) return;

        fetchDirectories();
    }, [selectedDocId, fetchDirectories]);

    return (
        <Drawer
            size="md"
            variant="plain"
            open={open}
            onClose={closeDrawer}
            slotProps={{
                content: {
                    sx: {
                        bgcolor: "transparent",
                        p: { md: 3, sm: 0 },
                        boxShadow: "none",
                    },
                },
            }}
        >
            <Sheet
                sx={{
                    borderRadius: "md",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                    overflow: "auto",
                }}
            >
                <DialogTitle
                    sx={{
                        color: textPrimary,
                    }}
                >
                    Disponibles para ver
                </DialogTitle>
                <ModalClose />
                <Divider sx={{ mt: "auto", bgcolor: neutralBg }} />
                <DialogContent sx={{ gap: 0 }}>
                    <FormControl
                        sx={{
                            paddingLeft: 2,
                        }}
                    >
                        <FormLabel
                            sx={{
                                typography: "title-md",
                                fontWeight: "bold",
                            }}
                        >
                            Categorias:
                        </FormLabel>
                        <RadioGroup
                            value={selectedDocId || ""}
                            onChange={(event) => {
                                handleClick(event.target.value);
                            }}
                        >
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fill, minmax(140px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                {mainDirectories.map((dir) => (
                                    <Card
                                        key={
                                            "drawer-main-dir-" + dir.documentId
                                        }
                                        sx={{
                                            boxShadow: "none",
                                            "&:hover": {
                                                bgcolor: "background.level1",
                                            },
                                        }}
                                        onClick={() =>
                                            handleClick(dir.documentId)
                                        }
                                    >
                                        <CardContent>
                                            <Typography
                                                level="title-md"
                                                sx={{
                                                    color:
                                                        selectedDocId ===
                                                        dir.documentId
                                                            ? "primary.500"
                                                            : undefined,
                                                }}
                                            >
                                                {dir.display_name}
                                            </Typography>
                                        </CardContent>
                                        <Radio
                                            disableIcon
                                            overlay
                                            checked={
                                                selectedDocId === dir.documentId
                                            }
                                            variant="outlined"
                                            color="neutral"
                                            value={dir.documentId}
                                            sx={{ mt: -2 }}
                                            slotProps={{
                                                action: {
                                                    sx: {
                                                        ...(selectedDocId ===
                                                            dir.documentId && {
                                                            borderWidth: 2,
                                                            borderColor:
                                                                "var(--joy-palette-primary-outlinedBorder)",
                                                        }),
                                                        "&:hover": {
                                                            bgcolor:
                                                                "transparent",
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </Card>
                                ))}
                            </Box>
                        </RadioGroup>
                    </FormControl>
                    <DrawerListContent
                        loadingState={loadingState}
                        directories={directories}
                        parentId={selectedDocId || ""}
                    />
                </DialogContent>
                <Divider sx={{ mt: "auto", bgcolor: neutralBg }} />
                <Stack
                    direction="row"
                    useFlexGap
                    spacing={1}
                    sx={{ justifyContent: "end" }}
                >
                    <Button
                        onClick={closeDrawer}
                        variant="outlined"
                        color="neutral"
                        sx={{
                            color: textPrimary,
                            ":hover": {
                                color: darkText,
                            },
                        }}
                    >
                        Cerrar
                    </Button>
                </Stack>
            </Sheet>
        </Drawer>
    );
};

export default DrawerList;
