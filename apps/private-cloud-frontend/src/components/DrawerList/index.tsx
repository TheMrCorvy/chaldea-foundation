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
import { FC, useEffect, useState } from "react";
import { Directory } from "@repo/type-definitions";
import { themeConfig } from "@/lib/theme";
import { Radio } from "@mui/joy";
import DrawerListContent from "../DrawerListContent";
import { logData } from "@repo/shared-utils/log-data";
import { GroupedDirectories } from "@/utils/directories";
import useStyles from "./useStyles";

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

    useEffect(() => {
        if (!selectedDocId) return;

        let isMounted = true;

        fetch(`/api/get-directories/${selectedDocId}`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (isMounted) {
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
                }
            })
            .catch((error) => {
                if (isMounted) {
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
            });

        return () => {
            isMounted = false;
        };
    }, [selectedDocId]);

    const {
        root,
        mainContainer,
        formControl,
        formLabel,
        buttonContainer,
        card,
    } = useStyles();

    return (
        <Drawer
            size="md"
            variant="plain"
            open={open}
            onClose={closeDrawer}
            slotProps={{
                content: {
                    sx: root,
                },
            }}
        >
            <Sheet sx={mainContainer}>
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
                    <FormControl sx={formControl}>
                        <FormLabel sx={formLabel}>Categorias:</FormLabel>
                        <RadioGroup
                            value={selectedDocId || ""}
                            onChange={(event) => {
                                handleClick(event.target.value);
                            }}
                        >
                            <Box sx={buttonContainer}>
                                {mainDirectories.map((dir) => (
                                    <Card
                                        key={
                                            "drawer-main-dir-" + dir.documentId
                                        }
                                        sx={card}
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
